namespace Crm.Api.DTOs.Responses;

public class PromotionListResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string PromotionType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal? DiscountValue { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
