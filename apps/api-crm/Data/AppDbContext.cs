using Crm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Crm.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<CustomerProfile> CustomerProfiles => Set<CustomerProfile>();
    public DbSet<OrderHistory> OrderHistories => Set<OrderHistory>();
    public DbSet<MarketingInteraction> MarketingInteractions => Set<MarketingInteraction>();
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<Message> Messages => Set<Message>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
