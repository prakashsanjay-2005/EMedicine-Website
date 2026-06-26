namespace EMedicine.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        public int CartId { get; set; }
        public Cart Cart { get; set; }

        public int MedicineId { get; set; }
        public Medicine Medicine { get; set; }

        public int Quantity { get; set; }
    }
}