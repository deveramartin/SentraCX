namespace Crm.Api.DTOs.Requests;

public class AttachPromotionsToCampaignRequestDto
{
    public List<Guid> PromotionIds { get; set; } = [];
}
