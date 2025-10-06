using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstate3D.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePropertyDataWithLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "admin-user-id",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "LastLoginAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "77ac35bc-e817-42a8-b3c6-dd7b144bb9a8", new DateTime(2025, 10, 6, 16, 31, 33, 496, DateTimeKind.Local).AddTicks(79), new DateTime(2025, 10, 6, 16, 31, 33, 496, DateTimeKind.Local).AddTicks(82), "AQAAAAIAAYagAAAAEOF66UUCp+kTa6gZvZFLb8bVcbBe8ss9V3/UWbQkXJ9J3/774pKT0/yN4ZITT+yTAw==", "3854927b-d5ef-4971-8856-6690e7c7f1b6" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Location" },
                values: new object[] { new DateTime(2025, 9, 26, 16, 31, 33, 570, DateTimeKind.Local).AddTicks(9871), "Москва, Центральный округ" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Location" },
                values: new object[] { new DateTime(2025, 10, 1, 16, 31, 33, 570, DateTimeKind.Local).AddTicks(9888), "Московская область, Одинцово" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Location" },
                values: new object[] { new DateTime(2025, 10, 4, 16, 31, 33, 570, DateTimeKind.Local).AddTicks(9898), "Санкт-Петербург, Приморский район" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "admin-user-id",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "LastLoginAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4fe82ff2-d27a-47c6-b02a-ee03b501d876", new DateTime(2025, 10, 6, 16, 28, 45, 302, DateTimeKind.Local).AddTicks(8861), new DateTime(2025, 10, 6, 16, 28, 45, 302, DateTimeKind.Local).AddTicks(8863), "AQAAAAIAAYagAAAAEMzwF7ekw127Sxi3BlRwbwxRc3mXQHaO+Zyrbn/h0QYZOQMsXpysU/KAcry+zVP96A==", "13b9eafa-0219-4d40-b4da-0a657f437371" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Location" },
                values: new object[] { new DateTime(2025, 9, 26, 16, 28, 45, 377, DateTimeKind.Local).AddTicks(9929), "" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Location" },
                values: new object[] { new DateTime(2025, 10, 1, 16, 28, 45, 377, DateTimeKind.Local).AddTicks(9949), "" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Location" },
                values: new object[] { new DateTime(2025, 10, 4, 16, 28, 45, 377, DateTimeKind.Local).AddTicks(9959), "" });
        }
    }
}
