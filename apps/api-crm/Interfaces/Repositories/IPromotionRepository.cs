using Crm.Api.Models;

namespace Crm.Api.Interfaces.Repositories;

public interface IPromotionRepository
{
    Task<IEnumerable<Promotion>> GetAllAsync(string? status = null);
    Task<Promotion?> GetByIdAsync(Guid id);
    Task<Promotion> AddAsync(Promotion promotion);
    Task UpdateAsync(Promotion promotion);
    Task DeleteAsync(Guid id);
}
