using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;

namespace Crm.Api.Interfaces.Services;

public interface ITemplateService
{
    Task<IEnumerable<TemplateListResponseDto>> GetAllAsync(string? channel = null);
    Task<TemplateResponseDto?> GetByIdAsync(Guid id);
    Task<TemplateResponseDto> CreateAsync(CreateTemplateRequestDto dto);
    Task<bool> DeleteAsync(Guid id);
}
