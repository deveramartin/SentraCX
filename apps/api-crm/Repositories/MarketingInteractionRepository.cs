using Crm.Api.Data;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Crm.Api.Repositories;

public class MarketingInteractionRepository(AppDbContext context) : IMarketingInteractionRepository
{
    public async Task<(List<MarketingInteraction> Items, int TotalCount)> GetByCustomerIdAsync(
        Guid customerId, int page, int pageSize)
    {
        var query = context.MarketingInteractions
            .Where(mi => mi.CustomerId == customerId);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(mi => mi.SentAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task AddAsync(MarketingInteraction interaction)
    {
        context.MarketingInteractions.Add(interaction);
        await context.SaveChangesAsync();
    }
}
