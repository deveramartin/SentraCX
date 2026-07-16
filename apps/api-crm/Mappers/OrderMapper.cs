using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;
using Crm.Api.Models;

namespace Crm.Api.Mappers;

public static class OrderMapper
{
    public static OrderResponseDto ToResponse(OrderHistory order)
    {
        return new OrderResponseDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            OrderedAt = order.OrderedAt
        };
    }

    public static OrderHistory FromWebhook(OrderWebhookRequestDto dto)
    {
        return new OrderHistory
        {
            CustomerId = dto.CustomerId,
            OrderNumber = dto.OrderNumber,
            TotalAmount = dto.TotalAmount,
            Status = dto.Status,
            OrderedAt = dto.OrderedAt
        };
    }
}
