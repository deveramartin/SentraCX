using Crm.Api.DTOs.Responses;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Interfaces.Services;
using Crm.Api.Mappers;

namespace Crm.Api.Services;

public class MarketingInteractionService(IMarketingInteractionRepository repository) : IMarketingInteractionService
{
    public async Task<PaginatedResponseDto<MarketingInteractionResponseDto>> GetByCustomerIdAsync(
        Guid customerId, int page, int pageSize)
    {
        var (items, totalCount) = await repository.GetByCustomerIdAsync(customerId, page, pageSize);

        return new PaginatedResponseDto<MarketingInteractionResponseDto>
        {
            Items = items.Select(i => i.ToDto()).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
        };
    }
}
