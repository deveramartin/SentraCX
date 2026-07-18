using Crm.Api.Models;

namespace Crm.Api.Interfaces.Repositories;

public interface IMarketingInteractionRepository
{
    Task<(List<MarketingInteraction> Items, int TotalCount)> GetByCustomerIdAsync(Guid customerId, int page, int pageSize);
    Task AddAsync(MarketingInteraction interaction);
}
