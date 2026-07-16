using Crm.Api.DTOs.Requests;
using FluentValidation;

namespace Crm.Api.Validators;

public class UpdateTicketStatusRequestValidator : AbstractValidator<UpdateTicketStatusRequestDto>
{
    private static readonly string[] ValidStatuses =
        ["Unclaimed", "Claimed", "Ongoing", "Completed", "Canceled"];

    public UpdateTicketStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(s => ValidStatuses.Contains(s))
            .WithMessage("Status must be one of: Unclaimed, Claimed, Ongoing, Completed, Canceled.");
    }
}
