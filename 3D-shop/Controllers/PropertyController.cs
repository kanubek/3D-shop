using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstate3D.Models;
using RealEstate3D.Data;
using RealEstate3D.Services;

namespace RealEstate3D.Controllers
{
    public class PropertyController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IAI3DService _aiService;
        private readonly IFileService _fileService;

        public PropertyController(
            ApplicationDbContext context, 
            IAI3DService aiService, 
            IFileService fileService)
        {
            _context = context;
            _aiService = aiService;
            _fileService = fileService;
        }

        public async Task<IActionResult> Index(string? search, string? type, decimal? minPrice, decimal? maxPrice)
        {
            var query = _context.Properties.Include(p => p.Images).AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Title.Contains(search) || p.Address.Contains(search));
            }

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(p => p.PropertyType == type);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            var properties = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();

            var model = new PropertyViewModel
            {
                Properties = properties,
                TotalProperties = properties.Count,
                SearchQuery = search ?? "",
                PropertyType = type ?? "",
                MinPrice = minPrice ?? 0,
                MaxPrice = maxPrice ?? 0
            };

            return View(model);
        }

        public async Task<IActionResult> Details(int id)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .Include(p => p.Owner)
                .FirstOrDefaultAsync(p => p.Id == id);
                
            if (property == null)
            {
                return NotFound();
            }

            // Увеличиваем счетчик просмотров
            property.ViewsCount++;
            await _context.SaveChangesAsync();

            return View(property);
        }

        public IActionResult Upload()
        {
            return View(new UploadPropertyViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> Upload(UploadPropertyViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Получаем текущего пользователя (позже добавим проверку авторизации)
                var userId = "admin-user-id"; // Временно, позже получим из User.Identity
                
                model.Property.OwnerId = userId;
                model.Property.CreatedAt = DateTime.Now;
                
                // Добавляем объект в базу данных
                _context.Properties.Add(model.Property);
                await _context.SaveChangesAsync();

                // Сохраняем изображения
                if (model.UploadedImages != null && model.UploadedImages.Count > 0)
                {
                    var savedImages = await _fileService.SaveImagesAsync(model.UploadedImages.ToList(), "properties");
                    
                    for (int i = 0; i < savedImages.Count; i++)
                    {
                        var propertyImage = new PropertyImage
                        {
                            PropertyId = model.Property.Id,
                            ImageUrl = savedImages[i],
                            Order = i,
                            IsPrimary = i == 0
                        };
                        _context.PropertyImages.Add(propertyImage);
                    }
                    
                    await _context.SaveChangesAsync();
                    
                    // Запускаем генерацию 3D модели
                    await _aiService.GenerateModel3D(model.Property.Id);
                }

                TempData["Success"] = "Объект недвижимости успешно добавлен! 3D модель будет готова через несколько минут.";
                return RedirectToAction("Details", new { id = model.Property.Id });
            }

            return View(model);
        }

                [HttpPost]
        public async Task<IActionResult> Generate3D(int propertyId)
        {
            var property = await _context.Properties.FindAsync(propertyId);
            if (property != null)
            {
                // Запускаем генерацию 3D модели
                var success = await _aiService.GenerateModel3D(propertyId);
                
                if (success)
                {
                    TempData["Success"] = "3D модель запущена в генерацию! Обновите страницу через несколько минут.";
                }
                else
                {
                    TempData["Error"] = "Ошибка при запуске генерации 3D модели.";
                }
            }
            else
            {
                TempData["Error"] = "Объект не найден.";
            }

            return RedirectToAction("Details", new { id = propertyId });
        }

        // Сравнение объектов недвижимости
        public async Task<IActionResult> Compare(string? ids)
        {
            var properties = new List<Property>();

            if (!string.IsNullOrEmpty(ids))
            {
                var propertyIds = ids.Split(',')
                                   .Where(id => int.TryParse(id, out _))
                                   .Select(int.Parse)
                                   .Take(3) // Максимум 3 объекта
                                   .ToArray();

                if (propertyIds.Any())
                {
                    properties = await _context.Properties
                        .Where(p => propertyIds.Contains(p.Id))
                        .ToListAsync();
                }
            }

            return View(properties);
        }

        // API для получения доступных объектов для сравнения
        [HttpGet]
        public async Task<IActionResult> GetAvailableProperties()
        {
            var properties = await _context.Properties
                .Select(p => new {
                    id = p.Id,
                    title = p.Title,
                    price = p.Price,
                    area = p.Area,
                    rooms = p.Rooms,
                    imagePath = p.ImagePath ?? "/images/no-image.svg"
                })
                .ToListAsync();

            return Json(properties);
        }

        // Карта объектов недвижимости
        public async Task<IActionResult> Map()
        {
            var properties = await _context.Properties.ToListAsync();
            
            // Добавляем координаты для кыргызских городов
            foreach (var property in properties)
            {
                // Устанавливаем координаты в зависимости от адреса
                if (property.Address.Contains("Бишкек"))
                {
                    if (property.Address.Contains("Восток-5"))
                        property.Coordinates = "42.8532,74.6235";
                    else if (property.Address.Contains("Асанбай"))
                        property.Coordinates = "42.9125,74.5847";
                    else
                        property.Coordinates = "42.8746,74.5698";
                }
                else if (property.Address.Contains("Ош"))
                {
                    property.Coordinates = "40.5283,72.7985";
                }
                else if (property.Address.Contains("Джалал-Абад"))
                {
                    property.Coordinates = "40.9336,72.9351";
                }
                else if (property.Address.Contains("Каракол"))
                {
                    property.Coordinates = "42.4906,78.3931";
                }
                else
                {
                    property.Coordinates = "42.8746,74.5698"; // Бишкек по умолчанию
                }
            }
            
            return View(properties);
        }
    }
}