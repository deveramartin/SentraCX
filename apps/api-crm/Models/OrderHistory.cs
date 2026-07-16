namespace Crm.Api.Models;

public class OrderHistory
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime OrderedAt { get; set; }

    // Navigation property
    public CustomerProfile CustomerProfile { get; set; } = null!;
}
