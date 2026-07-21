using Crm.Api.Interfaces.Repositories;

namespace Crm.Api.BackgroundJobs;

public class PromotionStatusJob(IServiceScopeFactory scopeFactory, ILogger<PromotionStatusJob> logger) : BackgroundService
{
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("PromotionStatusJob background service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var promotionRepository = scope.ServiceProvider.GetRequiredService<IPromotionRepository>();

                var activePromotions = await promotionRepository.GetAllAsync("Active");
                var now = DateTime.UtcNow;

                foreach (var promotion in activePromotions)
                {
                    if (promotion.EndDate.HasValue && promotion.EndDate.Value <= now)
                    {
                        promotion.Status = "Accomplished";
                        await promotionRepository.UpdateAsync(promotion);
                        logger.LogInformation("Promotion {PromotionId} status updated to Accomplished.", promotion.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while executing PromotionStatusJob.");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }
}
