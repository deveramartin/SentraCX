using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;
using Crm.Api.Models;

namespace Crm.Api.Mappers;

public static class TemplateMapper
{
    public static TemplateListResponseDto ToListDto(Template template)
    {
        return new TemplateListResponseDto
        {
            Id = template.Id,
            Name = template.Name,
            Description = template.Description,
            Channel = template.Channel,
            ThumbnailUrl = template.ThumbnailUrl,
            CreatedAt = template.CreatedAt
        };
    }

    public static TemplateResponseDto ToDetailDto(Template template)
    {
        return new TemplateResponseDto
        {
            Id = template.Id,
            Name = template.Name,
            Description = template.Description,
            ContentHtml = template.ContentHtml,
            ThumbnailUrl = template.ThumbnailUrl,
            Channel = template.Channel,
            CreatedAt = template.CreatedAt
        };
    }

    public static Template ToEntity(CreateTemplateRequestDto dto)
    {
        return new Template
        {
            Name = dto.Name,
            Description = dto.Description,
            ContentHtml = dto.ContentHtml,
            ThumbnailUrl = dto.ThumbnailUrl,
            Channel = dto.Channel,
            CreatedAt = DateTime.UtcNow
        };
    }
}
