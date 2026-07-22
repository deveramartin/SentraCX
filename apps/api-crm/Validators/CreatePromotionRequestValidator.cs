using Crm.Api.DTOs.Requests;
using FluentValidation;

namespace Crm.Api.Validators;

public class CreatePromotionRequestValidator : AbstractValidator<CreatePromotionRequestDto>
{
    public CreatePromotionRequestValidator()
    {
        RuleFor(p => p.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

        RuleFor(p => p.Description)
            .NotEmpty().WithMessage("Description is required.");

        RuleFor(p => p.PromotionType)
            .NotEmpty().WithMessage("Promotion type is required.");

        RuleFor(p => p.VoucherCode)
            .NotEmpty().When(p => string.Equals(p.PromotionType, "Voucher", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Voucher code is required when promotion type is Voucher.");

        RuleFor(p => p.DiscountValue)
            .NotNull().When(p => string.Equals(p.PromotionType, "Discount", StringComparison.OrdinalIgnoreCase) ||
                                 string.Equals(p.PromotionType, "Cashback", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Discount value is required for Discount and Cashback promotion types.");
    }
}
