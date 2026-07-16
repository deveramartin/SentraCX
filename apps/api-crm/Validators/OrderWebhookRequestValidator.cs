using Crm.Api.DTOs.Requests;
using FluentValidation;

namespace Crm.Api.Validators;

public class OrderWebhookRequestValidator : AbstractValidator<OrderWebhookRequestDto>
{
    public OrderWebhookRequestValidator()
    {
        RuleFor(x => x.EventType)
            .NotEmpty().WithMessage("EventType is required.")
            .Must(t => t is "OrderCreated" or "OrderUpdated")
            .WithMessage("EventType must be 'OrderCreated' or 'OrderUpdated'.");

        RuleFor(x => x.OrderNumber)
            .NotEmpty().WithMessage("OrderNumber is required.")
            .MaximumLength(100);

        RuleFor(x => x.CustomerId)
            .NotEmpty().WithMessage("CustomerId is required.");

        RuleFor(x => x.TotalAmount)
            .GreaterThanOrEqualTo(0).WithMessage("TotalAmount must be non-negative.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.");

        RuleFor(x => x.OrderedAt)
            .NotEmpty().WithMessage("OrderedAt is required.");
    }
}
