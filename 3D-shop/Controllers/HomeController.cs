using Microsoft.AspNetCore.Mvc;
using RealEstate3D.Models;

namespace RealEstate3D.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var model = new HomeViewModel
            {
                Title = "🏠 RealEstate3D - Недвижимость будущего 🏠",
                WelcomeMessage = "Революционная платформа недвижимости с 3D визуализацией от ИИ!",
                CurrentTime = DateTime.Now,
                UserName = "Будущий владелец",
                TotalProperties = 147,
                Properties3D = 89,
                FeaturedProperties = new List<Property>
                {
                    new Property 
                    { 
                        Id = 1, 
                        Title = "Современная квартира", 
                        Price = 15000000, 
                        PropertyType = "Квартира",
                        Area = 85.5,
                        Is3DGenerated = true 
                    },
                    new Property 
                    { 
                        Id = 2, 
                        Title = "Загородный дом", 
                        Price = 25000000, 
                        PropertyType = "Дом",
                        Area = 180.0,
                        Is3DGenerated = true 
                    }
                }
            };

            return View(model);
        }

        public IActionResult About()
        {
            ViewBag.Message = "О платформе RealEstate3D";
            return View();
        }

        public IActionResult Contact()
        {
            ViewBag.Message = "Контактная информация";
            return View();
        }

        [HttpGet]
        public IActionResult Api()
        {
            var data = new
            {
                platformName = "RealEstate3D",
                message = "Добро пожаловать в API недвижимости будущего!",
                timestamp = DateTime.Now,
                version = "3.0.0",
                status = "OK",
                totalProperties = 147,
                properties3D = 89,
                aiModelsGenerated = 234,
                averageGenerationTime = "2.3 минуты"
            };
            return Json(data);
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}