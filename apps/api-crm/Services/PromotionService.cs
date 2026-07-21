using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Interfaces.Services;
using Crm.Api.Mappers;
using Crm.Api.Models;

namespace Crm.Api.Services;

public class PromotionService(IPromotionRepository promotionRepository) : IPromotionService
{
    public async Task<IEnumerable<PromotionListResponseDto>> GetAllAsync(string? status = null)
    {
        var promotions = await promotionRepository.GetAllAsync(status);
        return promotions.Select(PromotionMapper.ToListDto);
    }

    public async Task<PromotionResponseDto?> GetByIdAsync(Guid id)
    {
        var promotion = await promotionRepository.GetByIdAsync(id);
        return promotion == null ? null : PromotionMapper.ToDetailDto(promotion);
    }

    public async Task<PromotionResponseDto> CreateAsync(CreatePromotionRequestDto dto)
    {
        var promotion = new Promotion
        {
            Title = dto.Title,
            Description = dto.Description,
            PromotionType = dto.PromotionType,
            DiscountValue = dto.DiscountValue,
            VoucherCode = dto.VoucherCode,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status,
            CreatedAt = DateTime.UtcNow
        };

        var created = await promotionRepository.AddAsync(promotion);
        return PromotionMapper.ToDetailDto(created);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdatePromotionRequestDto dto)
    {
        var promotion = await promotionRepository.GetByIdAsync(id);
        if (promotion == null) return false;

        // Draft promotions can be edited
        if (!string.Equals(promotion.Status, "Draft", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(dto.Title)) promotion.Title = dto.Title;
        if (!string.IsNullOrWhiteSpace(dto.Description)) promotion.Description = dto.Description;
        if (!string.IsNullOrWhiteSpace(dto.PromotionType)) promotion.PromotionType = dto.PromotionType;
        if (dto.DiscountValue.HasValue) promotion.DiscountValue = dto.DiscountValue;
        if (dto.VoucherCode != null) promotion.VoucherCode = dto.VoucherCode;
        if (dto.StartDate.HasValue) promotion.StartDate = dto.StartDate;
        if (dto.EndDate.HasValue) promotion.EndDate = dto.EndDate;
        if (!string.IsNullOrWhiteSpace(dto.Status)) promotion.Status = dto.Status;

        await promotionRepository.UpdateAsync(promotion);
        return true;
    }

    public async Task<bool> UpdateStatusAsync(Guid id, string status)
    {
        var promotion = await promotionRepository.GetByIdAsync(id);
        if (promotion == null) return false;

        promotion.Status = status;
        await promotionRepository.UpdateAsync(promotion);
        return true;
    }

    public async Task<bool> CancelAsync(Guid id)
    {
        var promotion = await promotionRepository.GetByIdAsync(id);
        if (promotion == null) return false;

        promotion.Status = "Cancelled";
        await promotionRepository.UpdateAsync(promotion);
        return true;
    }
}
