using Crm.Api.DTOs.Responses;
using Crm.Api.Models;

namespace Crm.Api.Mappers;

public static class TicketMapper
{
    public static TicketResponseDto ToDetailResponse(Ticket ticket)
    {
        return new TicketResponseDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            ImageUrl = ticket.ImageUrl,
            Status = ticket.Status,
            CustomerId = ticket.CustomerId,
            CustomerName = ticket.Customer?.User?.DisplayName ?? string.Empty,
            AssignedToId = ticket.AssignedToId,
            AssignedToName = ticket.AssignedTo?.DisplayName,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt
        };
    }

    public static TicketListResponseDto ToListResponse(Ticket ticket)
    {
        return new TicketListResponseDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Status = ticket.Status,
            CustomerName = ticket.Customer?.User?.DisplayName ?? string.Empty,
            UnreadMessageCount = ticket.Messages.Count(m => !m.IsRead),
            CreatedAt = ticket.CreatedAt
        };
    }
}
