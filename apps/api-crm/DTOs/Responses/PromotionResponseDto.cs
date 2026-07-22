namespace Crm.Api.DTOs.Responses;

public class PromotionResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PromotionType { get; set; } = string.Empty;
    public decimal? DiscountValue { get; set; }
    public string? VoucherCode { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
