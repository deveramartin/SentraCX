using Crm.Api.DTOs.Requests;
using FluentValidation;

namespace Crm.Api.Validators;

public class UpdateCustomerTypeRequestValidator
    : AbstractValidator<UpdateCustomerTypeRequestDto>
{
    public UpdateCustomerTypeRequestValidator()
    {
        RuleFor(x => x.CustomerType)
            .NotEmpty().WithMessage("CustomerType is required.")
            .Must(t => t is "Regular" or "InstitutionalBuyer")
            .WithMessage("CustomerType must be 'Regular' or 'InstitutionalBuyer'.");
    }
}
