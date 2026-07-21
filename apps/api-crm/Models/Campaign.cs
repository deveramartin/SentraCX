namespace Crm.Api.Models;

public class Campaign
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Channels { get; set; } = []; // Email, InApp, Facebook, Twitter, Instagram
    public string Status { get; set; } = "Draft"; // Draft, Active, Ended
    public Guid? TemplateId { get; set; }
    public string? ImageUrl { get; set; }
    public string CreatedById { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public User CreatedBy { get; set; } = null!;
    public Template? Template { get; set; }
    public CampaignSchedule? CampaignSchedule { get; set; }
    public ICollection<MarketingInteraction> MarketingInteractions { get; set; } = [];
    public ICollection<CampaignPromotion> CampaignPromotions { get; set; } = [];
}
