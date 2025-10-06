using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealEstate3D.Models;

namespace RealEstate3D.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Property> Properties { get; set; } = null!;
        public DbSet<PropertyImage> PropertyImages { get; set; } = null!;
        public DbSet<FavoriteProperty> FavoriteProperties { get; set; } = null!;
        public DbSet<PropertyView> PropertyViews { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Настройка связей
            builder.Entity<Property>()
                .HasOne(p => p.Owner)
                .WithMany(u => u.Properties)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<PropertyImage>()
                .HasOne(pi => pi.Property)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<FavoriteProperty>()
                .HasOne(fp => fp.User)
                .WithMany(u => u.FavoriteProperties)
                .HasForeignKey(fp => fp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<FavoriteProperty>()
                .HasOne(fp => fp.Property)
                .WithMany(p => p.FavoriteProperties)
                .HasForeignKey(fp => fp.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PropertyView>()
                .HasOne(pv => pv.Property)
                .WithMany(p => p.PropertyViews)
                .HasForeignKey(pv => pv.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PropertyView>()
                .HasOne(pv => pv.User)
                .WithMany(u => u.PropertyViews)
                .HasForeignKey(pv => pv.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Индексы для производительности
            builder.Entity<Property>()
                .HasIndex(p => p.PropertyType);
            
            builder.Entity<Property>()
                .HasIndex(p => p.Price);
            
            builder.Entity<Property>()
                .HasIndex(p => p.CreatedAt);
            
            builder.Entity<Property>()
                .HasIndex(p => p.Status);

            builder.Entity<PropertyView>()
                .HasIndex(pv => pv.ViewedAt);

            // Данные по умолчанию
            SeedData(builder);
        }

        private void SeedData(ModelBuilder builder)
        {
            // Создаем тестового пользователя
            var adminUserId = "admin-user-id";
            var passwordHasher = new Microsoft.AspNetCore.Identity.PasswordHasher<ApplicationUser>();
            var adminUser = new ApplicationUser
            {
                Id = adminUserId,
                UserName = "admin@realestate3d.kg",
                NormalizedUserName = "ADMIN@REALESTATE3D.KG",
                Email = "admin@realestate3d.kg",
                NormalizedEmail = "ADMIN@REALESTATE3D.KG",
                EmailConfirmed = true,
                FirstName = "Администратор",
                LastName = "Системы",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.Now,
                LastLoginAt = DateTime.Now,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "Admin123!");
            
            builder.Entity<ApplicationUser>().HasData(adminUser);

            // Создаем тестовые объекты недвижимости для Кыргызстана
            builder.Entity<Property>().HasData(
                new Property
                {
                    Id = 1,
                    Title = "Современная 3-комнатная квартира в Бишкеке",
                    Description = "Просторная квартира с панорамными окнами, современным ремонтом и отличным видом на горы Ала-Тоо. Все коммуникации новые, встроенная кухня, просторные комнаты.",
                    Address = "Бишкек, микрорайон Восток-5, дом 15",
                    Location = "Бишкек, Восток-5",
                    Price = 1312500000, // 15,000,000 RUB * 87.5 = 1,312,500,000 KGS
                    PropertyType = "Квартира",
                    Rooms = 3,
                    Area = 85.5,
                    Floor = 12,
                    TotalFloors = 25,
                    Is3DGenerated = true,
                    AI3DStatus = AI3DStatus.Completed,
                    Model3DUrl = "/models/apartment1.glb",
                    ContactInfo = "+996 (555) 123-456",
                    Status = PropertyStatus.Active,
                    OwnerId = adminUserId,
                    ViewsCount = 156,
                    FavoritesCount = 23,
                    Latitude = 42.8746, // Координаты Бишкека
                    Longitude = 74.5698,
                    CreatedAt = DateTime.Now.AddDays(-10)
                },
                new Property
                {
                    Id = 2,
                    Title = "Загородный дом в Оше с большим участком",
                    Description = "Двухэтажный дом в экологически чистом районе с видом на гору Сулайман-Тоо. Большой участок с садом, гараж на 2 машины, баня, беседка. Идеально для семьи с детьми.",
                    Address = "Ош, район Сулайман-Тоо, ул. Ленина 123",
                    Location = "Ош, Сулайман-Тоо",
                    Price = 2187500000, // 25,000,000 RUB * 87.5 = 2,187,500,000 KGS
                    PropertyType = "Дом",
                    Rooms = 5,
                    Area = 180.0,
                    Floor = 1,
                    TotalFloors = 2,
                    Is3DGenerated = true,
                    AI3DStatus = AI3DStatus.Completed,
                    Model3DUrl = "/models/house1.glb",
                    ContactInfo = "+996 (700) 765-432",
                    Status = PropertyStatus.Active,
                    OwnerId = adminUserId,
                    ViewsCount = 89,
                    FavoritesCount = 12,
                    Latitude = 40.5138, // Координаты Оша
                    Longitude = 72.7958,
                    CreatedAt = DateTime.Now.AddDays(-5)
                },
                new Property
                {
                    Id = 3,
                    Title = "Студия в Джалал-Абаде с ремонтом",
                    Description = "Уютная студия в новом жилом комплексе. Современная планировка, высокие потолки, французское остекление. Развитая инфраструктура района.",
                    Address = "Джалал-Абад, мкр. Кызыл-Шарк, дом 45",
                    Location = "Джалал-Абад, Кызыл-Шарк",
                    Price = 743750000, // 8,500,000 RUB * 87.5 = 743,750,000 KGS
                    PropertyType = "Студия",
                    Rooms = 1,
                    Area = 35.0,
                    Floor = 8,
                    TotalFloors = 17,
                    Is3DGenerated = false,
                    AI3DStatus = AI3DStatus.Processing,
                    ContactInfo = "+996 (770) 555-112",
                    Status = PropertyStatus.Active,
                    OwnerId = adminUserId,
                    ViewsCount = 67,
                    FavoritesCount = 8,
                    Latitude = 40.9356, // Координаты Джалал-Абада
                    Longitude = 73.0089,
                    CreatedAt = DateTime.Now.AddDays(-2)
                }
            );

            // Добавляем изображения для объектов недвижимости
            builder.Entity<PropertyImage>().HasData(
                // Изображения для квартиры (ID=1)
                new PropertyImage
                {
                    Id = 1,
                    PropertyId = 1,
                    ImageUrl = "/uploads/properties/apartment1.jpg",
                    IsPrimary = true,
                    Order = 0
                },
                // Изображения для дома (ID=2)
                new PropertyImage
                {
                    Id = 2,
                    PropertyId = 2,
                    ImageUrl = "/uploads/properties/house1.jpg",
                    IsPrimary = true,
                    Order = 0
                },
                // Изображения для студии (ID=3)
                new PropertyImage
                {
                    Id = 3,
                    PropertyId = 3,
                    ImageUrl = "/uploads/properties/cottage1.jpg",
                    IsPrimary = true,
                    Order = 0
                }
            );
        }
    }
}