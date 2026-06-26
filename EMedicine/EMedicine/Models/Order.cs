namespace EMedicine.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";

        public DateTime OrderDate { get; set; }
        public List<OrderItem> Items { get; set; }
    }
}
