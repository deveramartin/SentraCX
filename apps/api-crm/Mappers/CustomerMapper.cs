using Crm.Api.DTOs.Responses;
using Crm.Api.Models;

namespace Crm.Api.Mappers;

public static class CustomerMapper
{
    public static CustomerResponseDto ToDetailResponse(CustomerProfile profile)
    {
        return new CustomerResponseDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            Email = profile.User.Email,
            FirstName = profile.User.FirstName,
            LastName = profile.User.LastName,
            DisplayName = profile.User.DisplayName,
            PhoneNumber = profile.PhoneNumber,
            CustomerType = profile.CustomerType,
            Status = profile.Status,
            Notes = profile.Notes,
            ProfileImage = profile.ProfileImage,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt
        };
    }

    public static CustomerListResponseDto ToListResponse(CustomerProfile profile)
    {
        return new CustomerListResponseDto
        {
            Id = profile.Id,
            DisplayName = profile.User.DisplayName,
            Email = profile.User.Email,
            CustomerType = profile.CustomerType,
            Status = profile.Status
        };
    }
}
