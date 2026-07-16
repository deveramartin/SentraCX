namespace Crm.Api.DTOs.Requests;

public class OrderWebhookRequestDto
{
    public string EventType { get; set; } = string.Empty;
    public string OrderNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime OrderedAt { get; set; }
}
