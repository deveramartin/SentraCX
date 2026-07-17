using Crm.Api.Models;

namespace Crm.Api.Interfaces.Repositories;

public interface ITicketRepository
{
    Task<(List<Ticket> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize, string? status = null, Guid? customerId = null);
    Task<Ticket?> GetByIdAsync(Guid id);
    Task AddAsync(Ticket ticket);
    Task UpdateAsync(Ticket ticket);
}
