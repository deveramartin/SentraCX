using Crm.Api.Data;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Crm.Api.Repositories;

public class PromotionRepository(AppDbContext dbContext) : IPromotionRepository
{
    public async Task<IEnumerable<Promotion>> GetAllAsync(string? status = null)
    {
        var query = dbContext.Promotions.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(p => p.Status.ToLower() == status.ToLower());
        }

        return await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
    }

    public async Task<Promotion?> GetByIdAsync(Guid id)
    {
        return await dbContext.Promotions.FindAsync(id);
    }

    public async Task<Promotion> AddAsync(Promotion promotion)
    {
        dbContext.Promotions.Add(promotion);
        await dbContext.SaveChangesAsync();
        return promotion;
    }

    public async Task UpdateAsync(Promotion promotion)
    {
        dbContext.Promotions.Update(promotion);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var promotion = await dbContext.Promotions.FindAsync(id);
        if (promotion != null)
        {
            promotion.Status = "Cancelled";
            dbContext.Promotions.Update(promotion);
            await dbContext.SaveChangesAsync();
        }
    }
}
