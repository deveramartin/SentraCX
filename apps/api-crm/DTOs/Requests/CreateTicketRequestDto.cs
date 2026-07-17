namespace Crm.Api.DTOs.Requests;

public class CreateTicketRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}
