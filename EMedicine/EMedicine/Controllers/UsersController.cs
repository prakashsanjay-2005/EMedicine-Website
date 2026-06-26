using EMedicine.Data;
using EMedicine.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _db.Users
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName,
                x.Email,
                x.PhoneNumber,
                x.Address,
                x.City,
                x.Pincode,
                x.Role
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }


    [HttpGet("{id}/stats")]
    public async Task<IActionResult> GetUserStats(int id)
    {
        var totalOrders = await _db.Orders
            .CountAsync(x => x.UserId == id);

        var totalSpent = await _db.Orders
            .Where(x => x.UserId == id)
            .SumAsync(x => x.TotalAmount);

        return Ok(new
        {
            TotalOrders = totalOrders,
            TotalSpent = totalSpent
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(
    int id,
    User updatedUser)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        user.FirstName = updatedUser.FirstName;
        user.LastName = updatedUser.LastName;
        user.Email = updatedUser.Email;
        user.PhoneNumber = updatedUser.PhoneNumber;
        user.Address = updatedUser.Address;
        user.City = updatedUser.City;
        user.Pincode = updatedUser.Pincode;

        await _db.SaveChangesAsync();

        return Ok(user);
    }

    [HttpPut("{id}/change-password")]
    public async Task<IActionResult> ChangePassword(
    int id,
    ChangePasswordDto dto)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        bool validPassword =
            BCrypt.Net.BCrypt.Verify(
                dto.CurrentPassword,
                user.Password);

        if (!validPassword)
            return BadRequest("Current password is incorrect");

        user.Password =
            BCrypt.Net.BCrypt.HashPassword(
                dto.NewPassword);

        await _db.SaveChangesAsync();

        return Ok("Password changed successfully");
    }



    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _db.Users
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName,
                x.Email,
                x.Role,
                x.Status,
                x.PhoneNumber,
                x.Address,
                x.City,
                x.Pincode
            })
            .ToListAsync();

        return Ok(users);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var user = await _db.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        // Prevent disabling Admin accounts
        if (user.Role == "Admin")
        {
            return BadRequest("Admin account cannot be disabled.");
        }

        user.Status = user.Status == 1 ? 0 : 1;

        await _db.SaveChangesAsync();

        return Ok(user);
    }






}