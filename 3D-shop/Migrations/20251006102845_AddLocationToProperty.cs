using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstate3D.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationToProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Properties",
                type: "TEXT",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Properties");

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
    }
}
