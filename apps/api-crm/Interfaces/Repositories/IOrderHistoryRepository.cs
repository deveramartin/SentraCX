using Crm.Api.Models;

namespace Crm.Api.Interfaces.Repositories;

public interface IOrderHistoryRepository
{
    Task<List<OrderHistory>> GetByCustomerIdAsync(Guid customerId);
    Task<OrderHistory?> GetByOrderNumberAsync(string orderNumber);
    Task AddAsync(OrderHistory order);
    Task UpdateAsync(OrderHistory order);
}
