namespace Crm.Api.Models;

public class Ticket
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string Status { get; set; } = "Unclaimed";
    public Guid CustomerId { get; set; }
    public string? AssignedToId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public CustomerProfile Customer { get; set; } = null!;
    public User? AssignedTo { get; set; }
    public ICollection<Message> Messages { get; set; } = [];
}
