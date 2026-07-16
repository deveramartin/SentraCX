using Crm.Api.Models;

namespace Crm.Api.Repositories;

public interface ICustomerProfileRepository
{
    Task<(List<CustomerProfile> Items, int TotalCount)> GetAllAsync(int page, int pageSize);
    Task<CustomerProfile?> GetByIdAsync(Guid id);
    Task<CustomerProfile?> GetByUserIdAsync(string userId);
    Task AddAsync(CustomerProfile profile);
    Task UpdateAsync(CustomerProfile profile);
}
