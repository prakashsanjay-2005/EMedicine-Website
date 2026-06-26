using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMedicine.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "OrderDate",
                table: "Orders",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_MedicineId",
                table: "CartItems",
                column: "MedicineId");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Medicines_MedicineId",
                table: "CartItems",
                column: "MedicineId",
                principalTable: "Medicines",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Medicines_MedicineId",
                table: "CartItems");

            migrationBuilder.DropIndex(
                name: "IX_CartItems_MedicineId",
                table: "CartItems");

            migrationBuilder.DropColumn(
                name: "OrderDate",
                table: "Orders");
        }
    }
}
