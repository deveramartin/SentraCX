using Crm.Api.Data;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Crm.Api.Repositories;

public class OrderHistoryRepository(AppDbContext context) : IOrderHistoryRepository
{
    public async Task<List<OrderHistory>> GetByCustomerIdAsync(Guid customerId)
    {
        return await context.OrderHistories
            .Where(oh => oh.CustomerId == customerId)
            .OrderByDescending(oh => oh.OrderedAt)
            .ToListAsync();
    }

    public async Task<OrderHistory?> GetByOrderNumberAsync(string orderNumber)
    {
        return await context.OrderHistories
            .FirstOrDefaultAsync(oh => oh.OrderNumber == orderNumber);
    }

    public async Task AddAsync(OrderHistory order)
    {
        context.OrderHistories.Add(order);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(OrderHistory order)
    {
        context.OrderHistories.Update(order);
        await context.SaveChangesAsync();
    }
}
