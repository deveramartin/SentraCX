namespace Crm.Api.Models;

public class CampaignPromotion
{
    public Guid CampaignId { get; set; }
    public Campaign Campaign { get; set; } = null!;

    public Guid PromotionId { get; set; }
    public Promotion Promotion { get; set; } = null!;
}
