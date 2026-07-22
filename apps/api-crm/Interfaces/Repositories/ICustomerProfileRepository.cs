using Crm.Api.Models;

namespace Crm.Api.Interfaces.Repositories;

public interface ICustomerProfileRepository
{
    Task<(List<CustomerProfile> Items, int TotalCount)> GetAllAsync(int page, int pageSize, string? customerType = null, string? searchTerm = null);
    Task<CustomerProfile?> GetByIdAsync(Guid id);
    Task<CustomerProfile?> GetByUserIdAsync(string userId);
    Task AddAsync(CustomerProfile profile);
    Task UpdateAsync(CustomerProfile profile);
}
