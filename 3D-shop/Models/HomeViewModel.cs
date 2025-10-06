namespace RealEstate3D.Models
{
    public class HomeViewModel
    {
        public string Title { get; set; } = "RealEstate3D";
        public string WelcomeMessage { get; set; } = "Недвижимость будущего с 3D визуализацией от ИИ!";
        public DateTime CurrentTime { get; set; } = DateTime.Now;
        public string UserName { get; set; } = "Покупатель";
        public int TotalProperties { get; set; } = 147;
        public int Properties3D { get; set; } = 89;
        public List<Property> FeaturedProperties { get; set; } = new List<Property>();
    }
}