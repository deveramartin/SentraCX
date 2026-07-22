using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Interfaces.Services;
using Crm.Api.Mappers;
using Crm.Api.Models;

namespace Crm.Api.Services;

public class TicketService(ITicketRepository ticketRepo) : ITicketService
{
    private static readonly Dictionary<string, HashSet<string>> ValidTransitions = new()
    {
        ["Claimed"] = ["Ongoing"],
        ["Ongoing"] = ["Completed"]
    };

    public async Task<PaginatedResponseDto<TicketListResponseDto>> GetAllAsync(
        int page, int pageSize, string? status = null, Guid? customerId = null, string? assignedToId = null)
    {
        var (items, totalCount) = await ticketRepo.GetAllAsync(page, pageSize, status, customerId, assignedToId);

        return new PaginatedResponseDto<TicketListResponseDto>
        {
            Items = items.Select(TicketMapper.ToListResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<TicketResponseDto?> GetByIdAsync(Guid id)
    {
        var ticket = await ticketRepo.GetByIdAsync(id);
        return ticket is null ? null : TicketMapper.ToDetailResponse(ticket);
    }

    public async Task<TicketResponseDto> CreateAsync(CreateTicketRequestDto dto, Guid customerId)
    {
        var ticket = new Ticket
        {
            CustomerId = customerId,
            Title = dto.Title,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            Status = "Unclaimed",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await ticketRepo.AddAsync(ticket);

        var created = await ticketRepo.GetByIdAsync(ticket.Id);
        return TicketMapper.ToDetailResponse(created!);
    }

    public async Task<bool> ClaimAsync(Guid id, string staffUserId)
    {
        var ticket = await ticketRepo.GetByIdAsync(id);
        if (ticket is null) return false;

        if (ticket.Status != "Unclaimed") return false;

        ticket.Status = "Claimed";
        ticket.AssignedToId = staffUserId;
        ticket.UpdatedAt = DateTime.UtcNow;
        await ticketRepo.UpdateAsync(ticket);
        return true;
    }

    public async Task<bool> UnclaimAsync(Guid id)
    {
        var ticket = await ticketRepo.GetByIdAsync(id);
        if (ticket is null) return false;

        if (ticket.Status != "Claimed") return false;

        ticket.Status = "Unclaimed";
        ticket.AssignedToId = null;
        ticket.UpdatedAt = DateTime.UtcNow;
        await ticketRepo.UpdateAsync(ticket);
        return true;
    }

    public async Task<bool> UpdateStatusAsync(Guid id, UpdateTicketStatusRequestDto dto)
    {
        var ticket = await ticketRepo.GetByIdAsync(id);
        if (ticket is null) return false;

        if (!IsValidTransition(ticket.Status, dto.Status)) return false;

        ticket.Status = dto.Status;
        ticket.UpdatedAt = DateTime.UtcNow;
        await ticketRepo.UpdateAsync(ticket);
        return true;
    }

    public async Task<bool> CancelAsync(Guid id)
    {
        var ticket = await ticketRepo.GetByIdAsync(id);
        if (ticket is null) return false;

        if (ticket.Status is "Completed" or "Canceled") return false;

        ticket.Status = "Canceled";
        ticket.UpdatedAt = DateTime.UtcNow;
        await ticketRepo.UpdateAsync(ticket);
        return true;
    }

    private static bool IsValidTransition(string currentStatus, string newStatus)
    {
        if (!ValidTransitions.TryGetValue(currentStatus, out var allowed))
            return false;

        return allowed.Contains(newStatus);
    }
}
