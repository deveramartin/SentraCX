namespace Crm.Api.Models;

public class Promotion
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PromotionType { get; set; } = string.Empty; // Discount, Voucher, FreeShipping, BuyOneGetOne, Cashback
    public decimal? DiscountValue { get; set; }
    public string? VoucherCode { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Active, Cancelled, Accomplished
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<CampaignPromotion> CampaignPromotions { get; set; } = [];
}
