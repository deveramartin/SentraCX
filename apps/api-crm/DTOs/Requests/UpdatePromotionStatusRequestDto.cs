namespace Crm.Api.DTOs.Requests;

public class UpdatePromotionStatusRequestDto
{
    public string Status { get; set; } = string.Empty; // Draft, Active, Cancelled, Accomplished
}
