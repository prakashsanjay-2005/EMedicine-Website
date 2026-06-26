using EMedicine.Data;
using EMedicine.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly AppDbContext _db;

    public MedicinesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _db.Medicines.ToListAsync());
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Add(Medicine med)
    {
        _db.Medicines.Add(med);
        await _db.SaveChangesAsync();
        return Ok(med);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Medicine updatedMedicine)
    {
        var medicine = await _db.Medicines.FindAsync(id);

        if (medicine == null)
            return NotFound();

        medicine.Name = updatedMedicine.Name;
        medicine.Description = updatedMedicine.Description;
        medicine.Price = updatedMedicine.Price;
        medicine.Stock = updatedMedicine.Stock;
        medicine.ImageUrl = updatedMedicine.ImageUrl;

        await _db.SaveChangesAsync();

        return Ok(medicine);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var medicine = await _db.Medicines.FindAsync(id);

        if (medicine == null)
            return NotFound();

        _db.Medicines.Remove(medicine);

        await _db.SaveChangesAsync();

        return Ok("Medicine Deleted");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file selected");

        var fileName =
            Guid.NewGuid().ToString() +
            Path.GetExtension(file.FileName);

        var filePath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "images",
            fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new
        {
            imageUrl = $"/images/{fileName}"
        });
    }

}