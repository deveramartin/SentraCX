namespace Crm.Api.DTOs.Responses;

public class MessageResponseDto
{
    public Guid Id { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime SentAt { get; set; }
}
