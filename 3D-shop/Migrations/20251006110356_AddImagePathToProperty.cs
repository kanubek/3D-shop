using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstate3D.Migrations
{
    /// <inheritdoc />
    public partial class AddImagePathToProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Properties",
                type: "TEXT",
                nullable: true);

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
                columns: new[] { "CreatedAt", "ImagePath" },
                values: new object[] { new DateTime(2025, 9, 26, 17, 3, 55, 877, DateTimeKind.Local).AddTicks(4057), null });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "ImagePath" },
                values: new object[] { new DateTime(2025, 10, 1, 17, 3, 55, 877, DateTimeKind.Local).AddTicks(4070), null });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "ImagePath" },
                values: new object[] { new DateTime(2025, 10, 4, 17, 3, 55, 877, DateTimeKind.Local).AddTicks(4075), null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Properties");

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
                column: "CreatedAt",
                value: new DateTime(2025, 9, 26, 16, 31, 33, 570, DateTimeKind.Local).AddTicks(9871));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 1, 16, 31, 33, 570, DateTimeKind.Local).AddTicks(9888));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 4, 16, 31, 33, 570, DateTimeKind.Local).AddTicks(9898));
        }
    }
}
