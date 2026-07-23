using System;

namespace Crm.Api.DTOs.Responses;

public class AiTicketAnalysisResponseDto
{
    public string TicketId { get; set; } = string.Empty;
    public string Sentiment { get; set; } = string.Empty;
    public double SentimentScore { get; set; }
    public string PredictedCategory { get; set; } = string.Empty;
    public double UrgencyScore { get; set; }
    public double Confidence { get; set; }
    public string Reasoning { get; set; } = string.Empty;
    public DateTime ComputedAt { get; set; }
    public bool Cached { get; set; }
}
