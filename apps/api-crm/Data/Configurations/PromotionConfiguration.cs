using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Api.Data.Configurations;

public class PromotionConfiguration : IEntityTypeConfiguration<Promotion>
{
    public void Configure(EntityTypeBuilder<Promotion> builder)
    {
        builder.ToTable("promotions");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(p => p.Title).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Description).IsRequired().HasColumnType("text");
        builder.Property(p => p.PromotionType).IsRequired().HasMaxLength(50);
        builder.Property(p => p.DiscountValue).HasColumnType("decimal(18,2)");
        builder.Property(p => p.VoucherCode).HasMaxLength(100);
        builder.Property(p => p.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Draft");
        builder.Property(p => p.CreatedAt).HasDefaultValueSql("now()");
    }
}
