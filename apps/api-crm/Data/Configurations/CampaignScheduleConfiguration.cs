using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Api.Data.Configurations;

public class CampaignScheduleConfiguration : IEntityTypeConfiguration<CampaignSchedule>
{
    public void Configure(EntityTypeBuilder<CampaignSchedule> builder)
    {
        builder.ToTable("campaign_schedules");

        builder.HasKey(cs => cs.Id);
        builder.Property(cs => cs.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(cs => cs.CampaignId).IsRequired();
        builder.Property(cs => cs.ScheduleType).IsRequired().HasMaxLength(50);
        
        // Native PostgreSQL array representation for text array mapping
        builder.Property(cs => cs.RecurrenceDays);

        builder.Property(cs => cs.StartDate);
        builder.Property(cs => cs.EndDate);
        builder.Property(cs => cs.NextRunAt);

        builder.HasOne(cs => cs.Campaign)
            .WithOne(c => c.CampaignSchedule)
            .HasForeignKey<CampaignSchedule>(cs => cs.CampaignId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
