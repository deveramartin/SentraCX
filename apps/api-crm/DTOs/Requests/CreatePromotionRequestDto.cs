namespace Crm.Api.DTOs.Requests;

public class CreatePromotionRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PromotionType { get; set; } = "Discount"; // Discount, Voucher, FreeShipping, BuyOneGetOne, Cashback
    public decimal? DiscountValue { get; set; }
    public string? VoucherCode { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Active
}
