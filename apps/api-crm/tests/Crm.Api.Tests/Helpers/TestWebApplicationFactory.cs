using Crm.Api.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Crm.Api.Tests.Helpers;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"TestDb_{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove ALL DbContext-related service descriptors
            services.RemoveAll<AppDbContext>();
            services.RemoveAll<DbContextOptions<AppDbContext>>();
            services.RemoveAll<DbContextOptions>();

            // Remove services whose type contains EF/Npgsql to avoid provider conflicts
            var efDescriptors = services
                .Where(d => d.ServiceType.FullName?.Contains("EntityFramework") == true
                         || d.ServiceType.FullName?.Contains("Npgsql") == true
                         || d.ImplementationType?.FullName?.Contains("Npgsql") == true)
                .ToList();
            foreach (var d in efDescriptors)
                services.Remove(d);

            // Register InMemory provider fresh
            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase(_dbName));

            // Replace auth with a test scheme
            services.AddAuthentication(defaultScheme: "Test")
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                    "Test", _ => { });
        });

        builder.UseEnvironment("Testing");
    }
}
