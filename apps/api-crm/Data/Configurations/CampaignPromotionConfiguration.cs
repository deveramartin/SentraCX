using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Api.Data.Configurations;

public class CampaignPromotionConfiguration : IEntityTypeConfiguration<CampaignPromotion>
{
    public void Configure(EntityTypeBuilder<CampaignPromotion> builder)
    {
        builder.ToTable("campaign_promotions");

        builder.HasKey(cp => new { cp.CampaignId, cp.PromotionId });

        builder.HasOne(cp => cp.Campaign)
            .WithMany(c => c.CampaignPromotions)
            .HasForeignKey(cp => cp.CampaignId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cp => cp.Promotion)
            .WithMany(p => p.CampaignPromotions)
            .HasForeignKey(cp => cp.PromotionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
