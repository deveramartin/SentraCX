using Crm.Api.DTOs.Requests;
using FluentValidation;

namespace Crm.Api.Validators;

public class UpdateCustomerStatusRequestValidator
    : AbstractValidator<UpdateCustomerStatusRequestDto>
{
    public UpdateCustomerStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(s => s is "Active" or "Inactive" or "Suspended")
            .WithMessage("Status must be 'Active', 'Inactive', or 'Suspended'.");
    }
}
