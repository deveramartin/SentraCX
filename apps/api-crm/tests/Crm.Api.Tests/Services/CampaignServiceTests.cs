using Crm.Api.DTOs.Requests;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Models;
using Crm.Api.Services;
using Moq;

namespace Crm.Api.Tests.Services;

public class CampaignServiceTests
{
    private readonly Mock<ICampaignRepository> _campaignRepoMock = new();
    private readonly CampaignService _sut;

    public CampaignServiceTests()
    {
        _sut = new CampaignService(_campaignRepoMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsCampaignListDtos()
    {
        var campaigns = new List<Campaign>
        {
            new() { Id = Guid.NewGuid(), Title = "Campaign 1", Channels = ["Email"], Status = "Active" },
            new() { Id = Guid.NewGuid(), Title = "Campaign 2", Channels = ["InApp", "Facebook"], Status = "Draft" }
        };

        _campaignRepoMock.Setup(r => r.GetAllAsync(null)).ReturnsAsync(campaigns);

        var result = (await _sut.GetAllAsync()).ToList();

        Assert.Equal(2, result.Count);
        Assert.Equal("Campaign 1", result[0].Title);
        Assert.Equal("Active", result[0].Status);
    }

    [Fact]
    public async Task CreateAsync_AddsAndReturnsCampaign()
    {
        var dto = new CreateCampaignRequestDto
        {
            Title = "New Campaign",
            Subject = "Subject",
            Description = "Description",
            Channels = ["Email", "Twitter"],
            ScheduleType = "SendNow",
            Status = "Draft"
        };

        var createdId = Guid.NewGuid();
        _campaignRepoMock
            .Setup(r => r.AddAsync(It.IsAny<Campaign>()))
            .ReturnsAsync((Campaign c) => { c.Id = createdId; return c; });

        _campaignRepoMock
            .Setup(r => r.GetByIdAsync(createdId))
            .ReturnsAsync(new Campaign { Id = createdId, Title = "New Campaign", Subject = "Subject", Description = "Description", Channels = ["Email", "Twitter"], Status = "Draft" });

        var result = await _sut.CreateAsync(dto, "staff-1");

        Assert.Equal(createdId, result.Id);
        Assert.Equal("New Campaign", result.Title);
        _campaignRepoMock.Verify(r => r.AddAsync(It.IsAny<Campaign>()), Times.Once);
    }

    [Fact]
    public async Task UpdateStatusAsync_WhenCampaignExists_ReturnsTrue()
    {
        var id = Guid.NewGuid();
        var campaign = new Campaign { Id = id, Title = "Campaign", Status = "Draft" };

        _campaignRepoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(campaign);

        var result = await _sut.UpdateStatusAsync(id, "Active");

        Assert.True(result);
        Assert.Equal("Active", campaign.Status);
        _campaignRepoMock.Verify(r => r.UpdateAsync(campaign), Times.Once);
    }
}
