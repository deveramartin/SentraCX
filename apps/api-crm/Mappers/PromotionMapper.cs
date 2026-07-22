using Crm.Api.DTOs.Responses;
using Crm.Api.Models;

namespace Crm.Api.Mappers;

public static class PromotionMapper
{
    public static PromotionListResponseDto ToListDto(Promotion promotion)
    {
        return new PromotionListResponseDto
        {
            Id = promotion.Id,
            Title = promotion.Title,
            PromotionType = promotion.PromotionType,
            Status = promotion.Status,
            DiscountValue = promotion.DiscountValue,
            EndDate = promotion.EndDate,
            CreatedAt = promotion.CreatedAt
        };
    }

    public static PromotionResponseDto ToDetailDto(Promotion promotion)
    {
        return new PromotionResponseDto
        {
            Id = promotion.Id,
            Title = promotion.Title,
            Description = promotion.Description,
            PromotionType = promotion.PromotionType,
            DiscountValue = promotion.DiscountValue,
            VoucherCode = promotion.VoucherCode,
            StartDate = promotion.StartDate,
            EndDate = promotion.EndDate,
            Status = promotion.Status,
            CreatedAt = promotion.CreatedAt
        };
    }
}
