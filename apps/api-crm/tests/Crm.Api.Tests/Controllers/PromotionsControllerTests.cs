using Crm.Api.Controllers;
using Crm.Api.DTOs.Requests;
using Crm.Api.DTOs.Responses;
using Crm.Api.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Crm.Api.Tests.Controllers;

public class PromotionsControllerTests
{
    private readonly Mock<IPromotionService> _promotionServiceMock = new();
    private readonly PromotionsController _sut;

    public PromotionsControllerTests()
    {
        _sut = new PromotionsController(_promotionServiceMock.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkWithPromotions()
    {
        var list = new List<PromotionListResponseDto>
        {
            new() { Id = Guid.NewGuid(), Title = "Promo 1", Status = "Active" }
        };

        _promotionServiceMock.Setup(s => s.GetAllAsync(null)).ReturnsAsync(list);

        var result = await _sut.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsAssignableFrom<IEnumerable<PromotionListResponseDto>>(okResult.Value);
        Assert.Single(returned);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction()
    {
        var dto = new CreatePromotionRequestDto { Title = "Promo Title", PromotionType = "Discount" };
        var response = new PromotionResponseDto { Id = Guid.NewGuid(), Title = "Promo Title" };

        _promotionServiceMock.Setup(s => s.CreateAsync(dto)).ReturnsAsync(response);

        var result = await _sut.Create(dto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(response, createdResult.Value);
    }

    [Fact]
    public async Task Cancel_WhenSuccessful_ReturnsNoContent()
    {
        var id = Guid.NewGuid();
        _promotionServiceMock.Setup(s => s.CancelAsync(id)).ReturnsAsync(true);

        var result = await _sut.Cancel(id);

        Assert.IsType<NoContentResult>(result);
    }
}
