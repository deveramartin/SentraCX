using Crm.Api.Data;
using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Crm.Api.Repositories;

public class CustomerProfileRepository(AppDbContext context) : ICustomerProfileRepository
{
    public async Task<(List<CustomerProfile> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize)
    {
        var query = context.CustomerProfiles
            .Include(cp => cp.User)
            .Where(cp => !cp.User.IsDeleted)
            .OrderByDescending(cp => cp.CreatedAt);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<CustomerProfile?> GetByIdAsync(Guid id)
    {
        return await context.CustomerProfiles
            .Include(cp => cp.User)
            .FirstOrDefaultAsync(cp => cp.Id == id && !cp.User.IsDeleted);
    }

    public async Task<CustomerProfile?> GetByUserIdAsync(string userId)
    {
        return await context.CustomerProfiles
            .Include(cp => cp.User)
            .FirstOrDefaultAsync(cp => cp.UserId == userId && !cp.User.IsDeleted);
    }

    public async Task AddAsync(CustomerProfile profile)
    {
        context.CustomerProfiles.Add(profile);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(CustomerProfile profile)
    {
        context.CustomerProfiles.Update(profile);
        await context.SaveChangesAsync();
    }
}
