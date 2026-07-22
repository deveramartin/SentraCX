using Crm.Api.DTOs.Requests;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Models;
using Crm.Api.Services;
using Moq;

namespace Crm.Api.Tests.Services;

public class PromotionServiceTests
{
    private readonly Mock<IPromotionRepository> _promotionRepoMock = new();
    private readonly PromotionService _sut;

    public PromotionServiceTests()
    {
        _sut = new PromotionService(_promotionRepoMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsPromotions()
    {
        var promotions = new List<Promotion>
        {
            new() { Id = Guid.NewGuid(), Title = "Summer Discount", PromotionType = "Discount", DiscountValue = 15, Status = "Active" }
        };

        _promotionRepoMock.Setup(r => r.GetAllAsync("Active")).ReturnsAsync(promotions);

        var result = (await _sut.GetAllAsync("Active")).ToList();

        Assert.Single(result);
        Assert.Equal("Summer Discount", result[0].Title);
        Assert.Equal(15, result[0].DiscountValue);
    }

    [Fact]
    public async Task CreateAsync_AddsAndReturnsPromotion()
    {
        var dto = new CreatePromotionRequestDto
        {
            Title = "Voucher Deal",
            Description = "Get 10 off",
            PromotionType = "Voucher",
            VoucherCode = "VOUCHER10",
            Status = "Draft"
        };

        _promotionRepoMock
            .Setup(r => r.AddAsync(It.IsAny<Promotion>()))
            .ReturnsAsync((Promotion p) => { p.Id = Guid.NewGuid(); return p; });

        var result = await _sut.CreateAsync(dto);

        Assert.NotNull(result);
        Assert.Equal("Voucher Deal", result.Title);
        Assert.Equal("VOUCHER10", result.VoucherCode);
        _promotionRepoMock.Verify(r => r.AddAsync(It.IsAny<Promotion>()), Times.Once);
    }

    [Fact]
    public async Task CancelAsync_WhenPromotionExists_FlipsStatusToCancelled()
    {
        var id = Guid.NewGuid();
        var promotion = new Promotion { Id = id, Title = "Promo", Status = "Active" };

        _promotionRepoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(promotion);

        var result = await _sut.CancelAsync(id);

        Assert.True(result);
        Assert.Equal("Cancelled", promotion.Status);
        _promotionRepoMock.Verify(r => r.UpdateAsync(promotion), Times.Once);
    }
}
