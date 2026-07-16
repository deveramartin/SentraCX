using Crm.Api.DTOs.Requests;
using FluentValidation;

namespace Crm.Api.Validators;

public class CreateMessageRequestValidator : AbstractValidator<CreateMessageRequestDto>
{
    public CreateMessageRequestValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required.")
            .MaximumLength(5000).WithMessage("Content must not exceed 5000 characters.");
    }
}
