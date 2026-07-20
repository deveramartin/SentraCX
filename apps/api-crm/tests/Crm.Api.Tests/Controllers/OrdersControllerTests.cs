using System.Net;
using Crm.Api.Data;
using Crm.Api.Models;
using Crm.Api.Tests.Helpers;
using Microsoft.Extensions.DependencyInjection;

namespace Crm.Api.Tests.Controllers;

public class OrdersControllerTests(TestWebApplicationFactory factory)
    : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task GetByCustomer_WhenContact_ReturnsOk()
    {
        var customerId = await SeedCustomerAsync("Regular");

        var response = await _client.GetAsync($"/api/v1/customers/{customerId}/orders");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetByCustomer_WhenLead_Returns403()
    {
        var customerId = await SeedCustomerAsync("Lead");

        var response = await _client.GetAsync($"/api/v1/customers/{customerId}/orders");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    private async Task<Guid> SeedCustomerAsync(string type)
    {
        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            Email = $"seed-{Guid.NewGuid():N}@example.com",
            FirstName = "Seed",
            LastName = "Customer",
            DisplayName = "Seed Customer",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        dbContext.Users.Add(user);

        var profile = new CustomerProfile
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CustomerType = type,
            Status = "Active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        dbContext.CustomerProfiles.Add(profile);
        await dbContext.SaveChangesAsync();

        return profile.Id;
    }
}
