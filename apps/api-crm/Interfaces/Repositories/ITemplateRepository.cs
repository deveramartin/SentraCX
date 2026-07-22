using Crm.Api.Models;

namespace Crm.Api.Interfaces.Repositories;

public interface ITemplateRepository
{
    Task<IEnumerable<Template>> GetAllAsync(string? channel = null);
    Task<Template?> GetByIdAsync(Guid id);
    Task<Template> AddAsync(Template template);
    Task UpdateAsync(Template template);
    Task DeleteAsync(Guid id);
}
