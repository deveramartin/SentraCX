using Crm.Api.DTOs.Requests;
using FluentValidation;

namespace Crm.Api.Validators;

public class CreateCampaignRequestValidator : AbstractValidator<CreateCampaignRequestDto>
{
    public CreateCampaignRequestValidator()
    {
        RuleFor(c => c.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

        RuleFor(c => c.Subject)
            .NotEmpty().WithMessage("Subject is required.")
            .MaximumLength(200).WithMessage("Subject cannot exceed 200 characters.");

        RuleFor(c => c.Description)
            .NotEmpty().WithMessage("Description is required.");

        RuleFor(c => c.Channels)
            .NotEmpty().WithMessage("At least one marketing channel must be selected.");
    }
}
