using Crm.Api.DTOs.Responses;
using Crm.Api.Models;

namespace Crm.Api.Mappers;

public static class MessageMapper
{
    public static MessageResponseDto ToResponse(Message message)
    {
        return new MessageResponseDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            SenderName = message.Sender?.DisplayName ?? string.Empty,
            Content = message.Content,
            IsRead = message.IsRead,
            SentAt = message.SentAt
        };
    }
}
