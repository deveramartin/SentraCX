namespace Crm.Api.DTOs.Responses;

public class CampaignListResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<string> Channels { get; set; } = [];
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
