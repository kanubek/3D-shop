using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RealEstate3D.Migrations
{
    /// <inheritdoc />
    public partial class AddTestImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "admin-user-id",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "LastLoginAt", "SecurityStamp" },
                values: new object[] { "4b8c6dd7-db13-4d0f-a59c-ce6b6209bf50", new DateTime(2025, 10, 6, 15, 54, 50, 945, DateTimeKind.Local).AddTicks(3138), new DateTime(2025, 10, 6, 15, 54, 50, 945, DateTimeKind.Local).AddTicks(3140), "801ba7ea-0402-4af4-9aaa-b0e65c6895f1" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 26, 15, 54, 50, 945, DateTimeKind.Local).AddTicks(3477));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 1, 15, 54, 50, 945, DateTimeKind.Local).AddTicks(3496));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 4, 15, 54, 50, 945, DateTimeKind.Local).AddTicks(3505));

            migrationBuilder.InsertData(
                table: "PropertyImages",
                columns: new[] { "Id", "ImageUrl", "IsPrimary", "Order", "PropertyId" },
                values: new object[,]
                {
                    { 1, "/uploads/properties/apartment1.jpg", true, 0, 1 },
                    { 2, "/uploads/properties/house1.jpg", true, 0, 2 },
                    { 3, "/uploads/properties/cottage1.jpg", true, 0, 3 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "PropertyImages",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "PropertyImages",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "PropertyImages",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "admin-user-id",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "LastLoginAt", "SecurityStamp" },
                values: new object[] { "b2a66aef-8716-48b8-9d56-e2dfa5955a44", new DateTime(2025, 10, 6, 15, 50, 15, 253, DateTimeKind.Local).AddTicks(2024), new DateTime(2025, 10, 6, 15, 50, 15, 253, DateTimeKind.Local).AddTicks(2027), "6ba42776-daad-4ac3-b66e-e3a1aaef4d08" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 26, 15, 50, 15, 253, DateTimeKind.Local).AddTicks(2282));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 1, 15, 50, 15, 253, DateTimeKind.Local).AddTicks(2299));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 4, 15, 50, 15, 253, DateTimeKind.Local).AddTicks(2308));
        }
    }
}
