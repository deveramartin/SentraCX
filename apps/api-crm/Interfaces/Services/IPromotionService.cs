using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;

namespace Crm.Api.Interfaces.Services;

public interface IPromotionService
{
    Task<IEnumerable<PromotionListResponseDto>> GetAllAsync(string? status = null);
    Task<PromotionResponseDto?> GetByIdAsync(Guid id);
    Task<PromotionResponseDto> CreateAsync(CreatePromotionRequestDto dto);
    Task<bool> UpdateAsync(Guid id, UpdatePromotionRequestDto dto);
    Task<bool> UpdateStatusAsync(Guid id, string status);
    Task<bool> CancelAsync(Guid id);
}
