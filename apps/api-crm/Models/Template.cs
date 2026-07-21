namespace Crm.Api.Models;

public class Template
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ContentHtml { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string Channel { get; set; } = "Email";
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<Campaign> Campaigns { get; set; } = [];
}
