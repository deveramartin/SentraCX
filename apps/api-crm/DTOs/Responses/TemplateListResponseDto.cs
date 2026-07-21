namespace Crm.Api.DTOs.Responses;

public class TemplateListResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Channel { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
