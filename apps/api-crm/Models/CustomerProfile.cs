namespace Crm.Api.Models;

public class CustomerProfile
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string CustomerType { get; set; } = "Regular";
    public string Status { get; set; } = "Active";
    public string? Notes { get; set; }
    public string? ProfileImage { get; set; }
    public string? Address { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<OrderHistory> OrderHistories { get; set; } = [];
    public ICollection<Ticket> Tickets { get; set; } = [];
}
