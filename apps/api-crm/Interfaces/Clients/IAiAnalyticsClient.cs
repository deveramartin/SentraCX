using System;
using System.Threading;
using System.Threading.Tasks;
using Crm.Api.DTOs.Responses;

namespace Crm.Api.Interfaces.Clients;

public interface IAiAnalyticsClient
{
    Task<AiTicketAnalysisResponseDto?> AnalyzeTicketAsync(
        Guid ticketId,
        string? text = null,
        bool includeMessages = true,
        CancellationToken cancellationToken = default);
}
