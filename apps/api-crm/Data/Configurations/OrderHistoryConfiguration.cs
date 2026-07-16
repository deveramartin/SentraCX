using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Api.Data.Configurations;

public class OrderHistoryConfiguration : IEntityTypeConfiguration<OrderHistory>
{
    public void Configure(EntityTypeBuilder<OrderHistory> builder)
    {
        builder.ToTable("order_histories");

        builder.HasKey(oh => oh.Id);
        builder.Property(oh => oh.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(oh => oh.CustomerId).IsRequired();

        builder.Property(oh => oh.OrderNumber).IsRequired().HasMaxLength(100);
        builder.HasIndex(oh => oh.OrderNumber).IsUnique();

        builder.Property(oh => oh.TotalAmount).HasPrecision(18, 2);
        builder.Property(oh => oh.Status).IsRequired().HasMaxLength(50);
        builder.Property(oh => oh.OrderedAt).IsRequired();
    }
}
