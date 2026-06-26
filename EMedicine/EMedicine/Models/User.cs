namespace EMedicine.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "User";
        public int Status { get; set; } = 1;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Pincode { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
    }
}
