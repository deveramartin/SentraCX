using Crm.Api.Data;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Crm.Api.Repositories;

public class TemplateRepository(AppDbContext dbContext) : ITemplateRepository
{
    public async Task<IEnumerable<Template>> GetAllAsync(string? channel = null)
    {
        var query = dbContext.Templates.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(channel))
        {
            query = query.Where(t => t.Channel.ToLower() == channel.ToLower());
        }

        return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
    }

    public async Task<Template?> GetByIdAsync(Guid id)
    {
        return await dbContext.Templates.FindAsync(id);
    }

    public async Task<Template> AddAsync(Template template)
    {
        dbContext.Templates.Add(template);
        await dbContext.SaveChangesAsync();
        return template;
    }

    public async Task UpdateAsync(Template template)
    {
        dbContext.Templates.Update(template);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var template = await dbContext.Templates.FindAsync(id);
        if (template != null)
        {
            dbContext.Templates.Remove(template);
            await dbContext.SaveChangesAsync();
        }
    }
}
