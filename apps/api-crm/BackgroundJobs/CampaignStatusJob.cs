using Crm.Api.Interfaces.Repositories;

namespace Crm.Api.BackgroundJobs;

public class CampaignStatusJob(IServiceScopeFactory scopeFactory, ILogger<CampaignStatusJob> logger) : BackgroundService
{
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("CampaignStatusJob background service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var campaignRepository = scope.ServiceProvider.GetRequiredService<ICampaignRepository>();

                var activeCampaigns = await campaignRepository.GetAllAsync("Active");
                var now = DateTime.UtcNow;

                foreach (var campaign in activeCampaigns)
                {
                    if (campaign.CampaignSchedule?.EndDate.HasValue == true && campaign.CampaignSchedule.EndDate.Value <= now)
                    {
                        campaign.Status = "Ended";
                        await campaignRepository.UpdateAsync(campaign);
                        logger.LogInformation("Campaign {CampaignId} status updated to Ended.", campaign.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while executing CampaignStatusJob.");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }
}
