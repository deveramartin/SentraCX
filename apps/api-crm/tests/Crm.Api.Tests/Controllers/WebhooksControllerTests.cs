using System.Net;
using System.Net.Http.Json;
using Crm.Api.DTOs.Requests;
using Crm.Api.Tests.Helpers;

namespace Crm.Api.Tests.Controllers;

public class WebhooksControllerTests(TestWebApplicationFactory factory)
    : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task ProcessCustomerSignup_CreatesRegularCustomer()
    {
        var dto = new CustomerWebhookRequestDto
        {
            Email = $"signup-{Guid.NewGuid():N}@example.com",
            FirstName = "Signup",
            LastName = "User",
            PhoneNumber = "555-0200",
            Address = "123 Main St"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/webhooks/customer-signup", dto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task ProcessLeadSubmission_CreatesLeadCustomer()
    {
        var dto = new CustomerWebhookRequestDto
        {
            Email = $"lead-{Guid.NewGuid():N}@example.com",
            FirstName = "Lead",
            LastName = "User",
            PhoneNumber = "555-0300",
            Address = "456 Side St"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/webhooks/lead-submission", dto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
