using System;
using Microsoft.Extensions.DependencyInjection;
using Crm.Api.Clients;
using Crm.Api.Interfaces.Clients;

namespace Crm.Api.Extensions;

public static class HttpClientServiceExtensions
{
    public static IServiceCollection AddAiAnalyticsClient(this IServiceCollection services, string baseUri)
    {
        services.AddHttpClient<IAiAnalyticsClient, AiAnalyticsClient>(client =>
        {
            client.BaseAddress = new Uri(baseUri);
        })
        .AddStandardResilienceHandler();

        return services;
    }
}
