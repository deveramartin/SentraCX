using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;

namespace Crm.Api.Interfaces.Services;

public interface IOrderService
{
    Task<List<OrderResponseDto>> GetByCustomerIdAsync(Guid customerId);
    Task ProcessWebhookAsync(OrderWebhookRequestDto dto);
}
