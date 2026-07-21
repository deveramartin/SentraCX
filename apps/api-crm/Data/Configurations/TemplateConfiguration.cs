using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Api.Data.Configurations;

public class TemplateConfiguration : IEntityTypeConfiguration<Template>
{
    public void Configure(EntityTypeBuilder<Template> builder)
    {
        builder.ToTable("templates");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(t => t.Name).IsRequired().HasMaxLength(200);
        builder.Property(t => t.Description).HasMaxLength(500);
        builder.Property(t => t.ContentHtml).IsRequired().HasColumnType("text");
        builder.Property(t => t.ThumbnailUrl).HasMaxLength(500);
        builder.Property(t => t.Channel).IsRequired().HasMaxLength(50).HasDefaultValue("Email");
        builder.Property(t => t.CreatedAt).HasDefaultValueSql("now()");
    }
}
