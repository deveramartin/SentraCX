using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Crm.Api.DTOs.Responses;
using Crm.Api.Interfaces.Clients;

namespace Crm.Api.Clients;

public class AiAnalyticsClient : IAiAnalyticsClient
{
    private readonly HttpClient _httpClient;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        PropertyNameCaseInsensitive = true
    };

    public AiAnalyticsClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<AiTicketAnalysisResponseDto?> AnalyzeTicketAsync(
        Guid ticketId,
        string? text = null,
        bool includeMessages = true,
        CancellationToken cancellationToken = default)
    {
        var requestPayload = new
        {
            ticket_id = ticketId.ToString(),
            text,
            include_messages = includeMessages
        };

        var response = await _httpClient.PostAsJsonAsync(
            "api/v1/tickets/analyze-intent",
            requestPayload,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<AiTicketAnalysisResponseDto>(JsonOptions, cancellationToken);
    }
}
