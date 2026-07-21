namespace Crm.Api.DTOs.Responses;

public class TemplateResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ContentHtml { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string Channel { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
