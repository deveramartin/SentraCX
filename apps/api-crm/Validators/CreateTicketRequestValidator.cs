using Crm.Api.DTOs.Requests;
using FluentValidation;

namespace Crm.Api.Validators;

public class CreateTicketRequestValidator : AbstractValidator<CreateTicketRequestDto>
{
    public CreateTicketRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(5000).WithMessage("Description must not exceed 5000 characters.");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("Image URL must not exceed 500 characters.")
            .When(x => x.ImageUrl is not null);
    }
}
