using RealEstate3D.Data;
using RealEstate3D.Models;
using Microsoft.EntityFrameworkCore;

namespace RealEstate3D.Services
{
    public interface IAI3DService
    {
        Task<bool> GenerateModel3D(int propertyId);
        Task<AI3DStatus> GetGenerationStatus(int propertyId);
        Task<string?> GetModel3DUrl(int propertyId);
        Task<List<Property>> GetPropertiesInQueue();
    }

    public class AI3DService : IAI3DService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AI3DService> _logger;
        private readonly IWebHostEnvironment _environment;

        public AI3DService(ApplicationDbContext context, ILogger<AI3DService> logger, IWebHostEnvironment environment)
        {
            _context = context;
            _logger = logger;
            _environment = environment;
        }

        public async Task<bool> GenerateModel3D(int propertyId)
        {
            try
            {
                var property = await _context.Properties
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == propertyId);

                if (property == null)
                {
                    _logger.LogError("Property with ID {PropertyId} not found", propertyId);
                    return false;
                }

                // Проверяем, есть ли достаточно изображений
                if (property.Images.Count < 3)
                {
                    _logger.LogWarning("Property {PropertyId} has insufficient images for 3D generation", propertyId);
                    return false;
                }

                // Обновляем статус на "В процессе"
                property.AI3DStatus = AI3DStatus.Processing;
                property.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                _logger.LogInformation("Starting 3D generation for property {PropertyId}", propertyId);

                // Запускаем фоновую задачу генерации
                _ = Task.Run(() => ProcessAI3DGeneration(propertyId));

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting 3D generation for property {PropertyId}", propertyId);
                return false;
            }
        }

        private async Task ProcessAI3DGeneration(int propertyId)
        {
            try
            {
                // Симуляция процесса ИИ генерации (в реальности здесь будет вызов API ИИ)
                await Task.Delay(TimeSpan.FromMinutes(2)); // Симуляция 2 минут обработки

                var property = await _context.Properties.FindAsync(propertyId);
                if (property != null)
                {
                    // Симуляция успешной генерации
                    property.Model3DUrl = $"/models/generated_{propertyId}_{DateTime.Now:yyyyMMdd_HHmmss}.glb";
                    property.Is3DGenerated = true;
                    property.AI3DStatus = AI3DStatus.Completed;
                    property.UpdatedAt = DateTime.Now;

                    await _context.SaveChangesAsync();

                    _logger.LogInformation("3D generation completed for property {PropertyId}", propertyId);

                    // Здесь можно добавить уведомления пользователю
                    await SendGenerationCompletedNotification(propertyId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during 3D generation for property {PropertyId}", propertyId);

                // Обновляем статус на "Ошибка"
                var property = await _context.Properties.FindAsync(propertyId);
                if (property != null)
                {
                    property.AI3DStatus = AI3DStatus.Failed;
                    property.UpdatedAt = DateTime.Now;
                    await _context.SaveChangesAsync();
                }
            }
        }

        public async Task<AI3DStatus> GetGenerationStatus(int propertyId)
        {
            var property = await _context.Properties.FindAsync(propertyId);
            return property?.AI3DStatus ?? AI3DStatus.Pending;
        }

        public async Task<string?> GetModel3DUrl(int propertyId)
        {
            var property = await _context.Properties.FindAsync(propertyId);
            return property?.Model3DUrl;
        }

        public async Task<List<Property>> GetPropertiesInQueue()
        {
            return await _context.Properties
                .Where(p => p.AI3DStatus == AI3DStatus.Queued || p.AI3DStatus == AI3DStatus.Processing)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();
        }

        private async Task SendGenerationCompletedNotification(int propertyId)
        {
            // Здесь будет логика отправки уведомлений
            // Email, Push-уведомления, WebSocket и т.д.
            _logger.LogInformation("Notification sent for completed 3D generation of property {PropertyId}", propertyId);
            await Task.CompletedTask;
        }
    }

    // Сервис для работы с файлами
    public interface IFileService
    {
        Task<string> SaveImageAsync(IFormFile file, string folder);
        Task<bool> DeleteImageAsync(string imagePath);
        Task<List<string>> SaveImagesAsync(List<IFormFile> files, string folder);
        string GetImageUrl(string imagePath);
    }

    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<FileService> _logger;

        public FileService(IWebHostEnvironment environment, ILogger<FileService> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public async Task<string> SaveImageAsync(IFormFile file, string folder)
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("File is empty");

                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", folder);
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativePath = Path.Combine("uploads", folder, uniqueFileName).Replace("\\", "/");
                return $"/{relativePath}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving image file");
                throw;
            }
        }

        public async Task<List<string>> SaveImagesAsync(List<IFormFile> files, string folder)
        {
            var savedPaths = new List<string>();

            foreach (var file in files)
            {
                if (file != null && file.Length > 0)
                {
                    var path = await SaveImageAsync(file, folder);
                    savedPaths.Add(path);
                }
            }

            return savedPaths;
        }

        public async Task<bool> DeleteImageAsync(string imagePath)
        {
            try
            {
                if (string.IsNullOrEmpty(imagePath))
                    return false;

                var fullPath = Path.Combine(_environment.WebRootPath, imagePath.TrimStart('/'));
                
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image file: {ImagePath}", imagePath);
                return false;
            }
        }

        public string GetImageUrl(string imagePath)
        {
            return imagePath?.StartsWith("/") == true ? imagePath : $"/{imagePath}";
        }
    }

}