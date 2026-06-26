using EMedicine.Data;
using EMedicine.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("place")]
    public async Task<IActionResult> PlaceOrder(int userId)
    {
        var cart = await _db.Carts.FirstOrDefaultAsync(x => x.UserId == userId);

        if (cart == null)
            return BadRequest("Cart empty");

        var items = await _db.CartItems
            .Where(x => x.CartId == cart.Id)
            .ToListAsync();

        if (!items.Any())
            return BadRequest("Cart empty");

        decimal total = 0;

        // Check stock and calculate total
        foreach (var item in items)
        {
            var med = await _db.Medicines.FindAsync(item.MedicineId);

            if (med == null)
                return BadRequest("Medicine not found");

            if (med.Stock < item.Quantity)
                return BadRequest($"Insufficient stock for {med.Name}");

            total += med.Price * item.Quantity;
        }

        var order = new Order
        {
            UserId = userId,
            TotalAmount = total,
            Status = "Pending",
            OrderDate = DateTime.Now
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        foreach (var item in items)
        {
            var med = await _db.Medicines.FindAsync(item.MedicineId);

            // Deduct stock
            med.Stock -= item.Quantity;

            _db.OrderItems.Add(new OrderItem
            {
                OrderId = order.Id,
                MedicineId = item.MedicineId,
                Quantity = item.Quantity,
                Price = med.Price
            });
        }

        _db.CartItems.RemoveRange(items);

        await _db.SaveChangesAsync();

        return Ok("Order placed");
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetOrders(int userId)
    {
        var orders = await _db.Orders
            .Where(x => x.UserId == userId)
            .ToListAsync();

        return Ok(orders);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _db.Orders.ToListAsync();

        return Ok(orders);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/complete")]
    public async Task<IActionResult> CompleteOrder(int id)
    {
        var order = await _db.Orders.FindAsync(id);

        if (order == null)
            return NotFound();

        order.Status = "Completed";

        await _db.SaveChangesAsync();

        return Ok(order);
    }


    [Authorize(Roles = "Admin,User")]
    [HttpGet("{orderId}/items")]
    public async Task<IActionResult> GetOrderItems(int orderId)
    {
        var items = await _db.OrderItems
            .Where(x => x.OrderId == orderId)
            .Join(
                _db.Medicines,
                oi => oi.MedicineId,
                m => m.Id,
                (oi, m) => new
                {
                    oi.Id,
                    MedicineName = m.Name,
                    ImageUrl = m.ImageUrl,
                    oi.Quantity,
                    oi.Price
                }
            )
            .ToListAsync();

        return Ok(items);
    }




}