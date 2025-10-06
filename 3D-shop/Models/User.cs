using Microsoft.AspNetCore.Identity;

namespace RealEstate3D.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string? ProfilePicture { get; set; }
        public UserRole Role { get; set; } = UserRole.Buyer;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime LastLoginAt { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;
        
        // Связи
        public virtual ICollection<Property> Properties { get; set; } = new List<Property>();
        public virtual ICollection<FavoriteProperty> FavoriteProperties { get; set; } = new List<FavoriteProperty>();
        public virtual ICollection<PropertyView> PropertyViews { get; set; } = new List<PropertyView>();
    }

    public enum UserRole
    {
        Buyer,      // Покупатель
        Seller,     // Продавец
        Agent,      // Агент
        Admin       // Администратор
    }

    public class FavoriteProperty
    {
        public int Id { get; set; }
        public string UserId { get; set; } = "";
        public int PropertyId { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.Now;

        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Property Property { get; set; } = null!;
    }

    public class PropertyView
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public string? UserId { get; set; }
        public string IpAddress { get; set; } = "";
        public DateTime ViewedAt { get; set; } = DateTime.Now;
        public string UserAgent { get; set; } = "";

        public virtual Property Property { get; set; } = null!;
        public virtual ApplicationUser? User { get; set; }
    }
}