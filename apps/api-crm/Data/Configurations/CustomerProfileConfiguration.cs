using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Api.Data.Configurations;

public class CustomerProfileConfiguration : IEntityTypeConfiguration<CustomerProfile>
{
    public void Configure(EntityTypeBuilder<CustomerProfile> builder)
    {
        builder.ToTable("customer_profiles");

        builder.HasKey(cp => cp.Id);
        builder.Property(cp => cp.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(cp => cp.UserId).IsRequired().HasMaxLength(128);
        builder.HasIndex(cp => cp.UserId).IsUnique();

        builder.Property(cp => cp.PhoneNumber).HasMaxLength(20);
        builder.Property(cp => cp.CustomerType).IsRequired().HasMaxLength(50)
            .HasDefaultValue("Regular");
        builder.Property(cp => cp.Status).IsRequired().HasMaxLength(20)
            .HasDefaultValue("Active");
        builder.Property(cp => cp.Notes).HasColumnType("text");
        builder.Property(cp => cp.ProfileImage).HasMaxLength(500);
        builder.Property(cp => cp.Address).HasMaxLength(500);

        builder.Property(cp => cp.CreatedAt).HasDefaultValueSql("now()");
        builder.Property(cp => cp.UpdatedAt).HasDefaultValueSql("now()");

        builder.HasMany(cp => cp.OrderHistories)
            .WithOne(oh => oh.CustomerProfile)
            .HasForeignKey(oh => oh.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
