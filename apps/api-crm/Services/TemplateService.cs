using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Interfaces.Services;
using Crm.Api.Mappers;

namespace Crm.Api.Services;

public class TemplateService(ITemplateRepository templateRepository) : ITemplateService
{
    public async Task<IEnumerable<TemplateListResponseDto>> GetAllAsync(string? channel = null)
    {
        var templates = await templateRepository.GetAllAsync(channel);
        return templates.Select(TemplateMapper.ToListDto);
    }

    public async Task<TemplateResponseDto?> GetByIdAsync(Guid id)
    {
        var template = await templateRepository.GetByIdAsync(id);
        return template == null ? null : TemplateMapper.ToDetailDto(template);
    }

    public async Task<TemplateResponseDto> CreateAsync(CreateTemplateRequestDto dto)
    {
        var entity = TemplateMapper.ToEntity(dto);
        var created = await templateRepository.AddAsync(entity);
        return TemplateMapper.ToDetailDto(created);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var template = await templateRepository.GetByIdAsync(id);
        if (template == null) return false;

        await templateRepository.DeleteAsync(id);
        return true;
    }
}
