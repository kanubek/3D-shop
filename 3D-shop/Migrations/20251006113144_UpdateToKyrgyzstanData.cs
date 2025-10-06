using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstate3D.Migrations
{
    /// <inheritdoc />
    public partial class UpdateToKyrgyzstanData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Обновляем данные для Кыргызстана
            migrationBuilder.Sql(@"
                UPDATE Properties SET 
                    Address = CASE Id
                        WHEN 1 THEN 'Бишкек, микрорайон Восток-5, дом 15'
                        WHEN 2 THEN 'Ош, район Сулайман-Тоо, ул. Ленина 123'
                        WHEN 3 THEN 'Джалал-Абад, мкр. Кызыл-Шарк, дом 45'
                        WHEN 4 THEN 'Каракол, ул. Абдрахманова 78'
                        WHEN 5 THEN 'Бишкек, Асанбай, ул. Токтогула 234'
                        ELSE Address
                    END,
                    Location = CASE Id
                        WHEN 1 THEN 'Бишкек, Восток-5'
                        WHEN 2 THEN 'Ош, Сулайман-Тоо'
                        WHEN 3 THEN 'Джалал-Абад, Кызыл-Шарк'
                        WHEN 4 THEN 'Каракол, Центр'
                        WHEN 5 THEN 'Бишкек, Асанбай'
                        ELSE Location
                    END,
                    Price = Price * 87.5 -- Конвертируем рубли в сомы
                WHERE Id <= 5;
            ");
            
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "admin-user-id",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "LastLoginAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "403adb06-dc35-4aff-8217-7485a510bfc6", new DateTime(2025, 10, 6, 17, 31, 44, 270, DateTimeKind.Local).AddTicks(1492), new DateTime(2025, 10, 6, 17, 31, 44, 270, DateTimeKind.Local).AddTicks(1494), "AQAAAAIAAYagAAAAEAw5JWe9GFKnSYgjtHhsif67LLtoV/qKw/KwRQ5o0X86C2wVfAJDduPmapri7fcFAQ==", "403fba3b-70b4-4fbf-a398-e34e9f3914b2" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 26, 17, 31, 44, 313, DateTimeKind.Local).AddTicks(7079));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 1, 17, 31, 44, 313, DateTimeKind.Local).AddTicks(7094));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 4, 17, 31, 44, 313, DateTimeKind.Local).AddTicks(7105));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "admin-user-id",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "LastLoginAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fd59da87-7b37-4bf5-9206-bfee3f2ecb1d", new DateTime(2025, 10, 6, 17, 3, 55, 833, DateTimeKind.Local).AddTicks(9601), new DateTime(2025, 10, 6, 17, 3, 55, 833, DateTimeKind.Local).AddTicks(9602), "AQAAAAIAAYagAAAAEIcOsJ7LDDu+pX0wO3FwyQpP700wFvzzBCUHAc6W5WopkIqXsqMNF1pvMMi5ejvOgQ==", "b2da57fb-c31b-4308-8e64-396c7d64dfc9" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 26, 17, 3, 55, 877, DateTimeKind.Local).AddTicks(4057));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 1, 17, 3, 55, 877, DateTimeKind.Local).AddTicks(4070));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 4, 17, 3, 55, 877, DateTimeKind.Local).AddTicks(4075));
        }
    }
}
