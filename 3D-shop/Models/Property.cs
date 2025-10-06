using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealEstate3D.Models
{
    public class Property
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = "";
        
        [StringLength(2000)]
        public string Description { get; set; } = "";
        
        [Required]
        [StringLength(500)]
        public string Address { get; set; } = "";

        [Required]
        [StringLength(300)]
        public string Location { get; set; } = ""; // Город, район
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        [Required]
        [StringLength(50)]
        public string PropertyType { get; set; } = ""; // Квартира, Дом, Коттедж
        
        public int Rooms { get; set; }
        public double Area { get; set; }
        public int Floor { get; set; }
        public int TotalFloors { get; set; }
        
        public string? ImagePath { get; set; }
        public string? Model3DUrl { get; set; }
        public bool Is3DGenerated { get; set; } = false;
        
        [NotMapped] // Не сохраняем в БД, вычисляем динамически
        public string? Coordinates { get; set; }
        public AI3DStatus AI3DStatus { get; set; } = AI3DStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        
        [StringLength(20)]
        public string ContactInfo { get; set; } = "";
        
        public PropertyStatus Status { get; set; } = PropertyStatus.Active;
        
        // Владелец
        [Required]
        public string OwnerId { get; set; } = "";
        
        // Статистика
        public int ViewsCount { get; set; } = 0;
        public int FavoritesCount { get; set; } = 0;
        
        // Геолокация
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        
        // SEO
        [StringLength(200)]
        public string? MetaTitle { get; set; }
        [StringLength(500)]
        public string? MetaDescription { get; set; }

        // Связи
        public virtual ApplicationUser Owner { get; set; } = null!;
        public virtual ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
        public virtual ICollection<FavoriteProperty> FavoriteProperties { get; set; } = new List<FavoriteProperty>();
        public virtual ICollection<PropertyView> PropertyViews { get; set; } = new List<PropertyView>();

        // Вычисляемые свойства для обратной совместимости
        [NotMapped]
        public List<string> ImageUrls => Images?.OrderBy(i => i.Order).Select(i => i.ImageUrl).ToList() ?? new List<string>();
    }

    public class PropertyImage
    {
        public int Id { get; set; }
        
        [Required]
        public int PropertyId { get; set; }
        
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        public int Order { get; set; } = 0;
        
        public bool IsPrimary { get; set; } = false;
        
        // Navigation property
        public virtual Property Property { get; set; } = null!;
    }

    public class UploadPropertyViewModel
    {
        [Required]
        public Property Property { get; set; } = new Property();
        
        [Display(Name = "Изображения объекта")]
        public List<IFormFile>? UploadedImages { get; set; }
    }

    public enum AI3DStatus
    {
        Pending,        // Ожидает обработки
        Processing,     // В процессе генерации
        Completed,      // Готово
        Failed,         // Ошибка
        Queued          // В очереди
    }

    public enum PropertyStatus
    {
        Active,
        Sold,
        Reserved,
        Inactive
    }

    public class PropertyViewModel
    {
        public List<Property> Properties { get; set; } = new List<Property>();
        public int TotalProperties { get; set; }
        public string SearchQuery { get; set; } = "";
        public string PropertyType { get; set; } = "";
        public decimal MinPrice { get; set; } = 0;
        public decimal MaxPrice { get; set; } = 0;
    }
}