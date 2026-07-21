using Crm.Api.DTOs.Requests;
using FluentValidation;

namespace Crm.Api.Validators;

public class UpdatePromotionStatusRequestValidator : AbstractValidator<UpdatePromotionStatusRequestDto>
{
    private static readonly string[] AllowedStatuses = ["Draft", "Active", "Cancelled", "Accomplished"];

    public UpdatePromotionStatusRequestValidator()
    {
        RuleFor(s => s.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(status => AllowedStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Status must be one of: Draft, Active, Cancelled, Accomplished.");
    }
}
