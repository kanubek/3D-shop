using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstate3D.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminUserPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "admin-user-id",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "LastLoginAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1974d471-ed5c-481f-ae2e-f596305b57d1", new DateTime(2025, 10, 6, 16, 15, 4, 278, DateTimeKind.Local).AddTicks(2266), new DateTime(2025, 10, 6, 16, 15, 4, 278, DateTimeKind.Local).AddTicks(2270), "AQAAAAIAAYagAAAAEChNb4kuye9kNg0G9jsG4JcV1ixwyAcJKr/X3jrYdfGOIQq8xrWhadr5Zbo1I8ufaw==", "c943fbd7-ef4d-4c3c-8c3f-10ad39c93f94" });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 26, 16, 15, 4, 353, DateTimeKind.Local).AddTicks(3678));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 1, 16, 15, 4, 353, DateTimeKind.Local).AddTicks(3696));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 4, 16, 15, 4, 353, DateTimeKind.Local).AddTicks(3704));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "admin-user-id",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "LastLoginAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4b8c6dd7-db13-4d0f-a59c-ce6b6209bf50", new DateTime(2025, 10, 6, 15, 54, 50, 945, DateTimeKind.Local).AddTicks(3138), new DateTime(2025, 10, 6, 15, 54, 50, 945, DateTimeKind.Local).AddTicks(3140), null, "801ba7ea-0402-4af4-9aaa-b0e65c6895f1" });

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
        }
    }
}
