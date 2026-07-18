using Crm.Api.DTOs.Responses;

namespace Crm.Api.Interfaces.Services;

public interface IMarketingInteractionService
{
    Task<PaginatedResponseDto<MarketingInteractionResponseDto>> GetByCustomerIdAsync(Guid customerId, int page, int pageSize);
}
