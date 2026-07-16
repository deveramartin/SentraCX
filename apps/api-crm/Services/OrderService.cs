using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Interfaces.Services;
using Crm.Api.Mappers;

namespace Crm.Api.Services;

public class OrderService(IOrderHistoryRepository orderRepo) : IOrderService
{
    public async Task<List<OrderResponseDto>> GetByCustomerIdAsync(Guid customerId)
    {
        var orders = await orderRepo.GetByCustomerIdAsync(customerId);
        return orders.Select(OrderMapper.ToResponse).ToList();
    }

    public async Task ProcessWebhookAsync(OrderWebhookRequestDto dto)
    {
        var existing = await orderRepo.GetByOrderNumberAsync(dto.OrderNumber);

        if (existing is not null)
        {
            existing.Status = dto.Status;
            existing.TotalAmount = dto.TotalAmount;
            await orderRepo.UpdateAsync(existing);
        }
        else
        {
            var order = OrderMapper.FromWebhook(dto);
            await orderRepo.AddAsync(order);
        }
    }
}
