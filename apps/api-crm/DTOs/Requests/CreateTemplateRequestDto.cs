namespace Crm.Api.DTOs.Requests;

public class CreateTemplateRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ContentHtml { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string Channel { get; set; } = "Email";
}
