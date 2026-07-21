namespace Crm.Api.DTOs.Requests;

public class UpdatePromotionRequestDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? PromotionType { get; set; }
    public decimal? DiscountValue { get; set; }
    public string? VoucherCode { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Status { get; set; }
}
