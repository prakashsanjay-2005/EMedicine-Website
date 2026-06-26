using EMedicine.Data;
using EMedicine.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly AppDbContext _db;

    public CartController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart(int userId, int medicineId, int quantity)
    {
        var cart = await _db.Carts.FirstOrDefaultAsync(x => x.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _db.Carts.Add(cart);
            await _db.SaveChangesAsync();
        }

        var item = await _db.CartItems
     .FirstOrDefaultAsync(x =>
         x.CartId == cart.Id &&
         x.MedicineId == medicineId);

        if (item != null)
        {
            item.Quantity += quantity;
        }
        else
        {
            item = new CartItem
            {
                CartId = cart.Id,
                MedicineId = medicineId,
                Quantity = quantity
            };

            _db.CartItems.Add(item);
        }

        await _db.SaveChangesAsync();

        return Ok("Added to cart");
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(int userId)
    {
        var cart = await _db.Carts
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (cart == null)
            return Ok(new List<object>());

        var items = await _db.CartItems
            .Where(x => x.CartId == cart.Id)
            .Include(x => x.Medicine)
            .Select(x => new
            {
                x.Id,
                x.Quantity,
                MedicineId = x.MedicineId,
                MedicineName = x.Medicine.Name,
                Price = x.Medicine.Price,
                ImageUrl = x.Medicine.ImageUrl
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPut("increase/{id}")]
    public async Task<IActionResult> IncreaseQuantity(int id)
    {
        var item = await _db.CartItems.FindAsync(id);

        if (item == null)
            return NotFound();

        item.Quantity++;

        await _db.SaveChangesAsync();

        return Ok(item);
    }

    [HttpPut("decrease/{id}")]
    public async Task<IActionResult> DecreaseQuantity(int id)
    {
        var item = await _db.CartItems.FindAsync(id);

        if (item == null)
            return NotFound();

        if (item.Quantity > 1)
        {
            item.Quantity--;
            await _db.SaveChangesAsync();
        }

        return Ok(item);
    }

    [HttpDelete("remove/{id}")]
    public async Task<IActionResult> RemoveItem(int id)
    {
        var item = await _db.CartItems.FindAsync(id);

        if (item == null)
            return NotFound();

        _db.CartItems.Remove(item);

        await _db.SaveChangesAsync();

        return Ok("Removed");
    }
}