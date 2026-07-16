namespace Crm.Api.DTOs.Responses;

public class CustomerListResponseDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CustomerType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
