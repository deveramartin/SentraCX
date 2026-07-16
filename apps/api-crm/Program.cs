using Crm.Api.Data;
using Crm.Api.Helpers;
using Crm.Api.Middleware;
using Crm.Api.Interfaces.Repositories;
using Crm.Api.Interfaces.Services;
using Crm.Api.Repositories;
using Crm.Api.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

// Load .env file (if present) into environment variables
EnvLoader.Load();

var builder = WebApplication.CreateBuilder(args);

// Database — build connection string from environment variables
var dbHost = Environment.GetEnvironmentVariable("DATABASE_HOST") ?? "localhost";
var dbPort = Environment.GetEnvironmentVariable("DATABASE_PORT") ?? "5432";
var dbName = Environment.GetEnvironmentVariable("DATABASE_NAME") ?? "sentracx_crm";
var dbUser = Environment.GetEnvironmentVariable("DATABASE_USER") ?? "postgres";
var dbPassword = Environment.GetEnvironmentVariable("DATABASE_PASSWORD") ?? "postgres";
var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Authentication — read from environment variables
var jwtAuthority = Environment.GetEnvironmentVariable("JWT_AUTHORITY") ?? "https://localhost:5001";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "sentracx-crm-api";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = jwtAuthority;
        options.Audience = jwtAudience;
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    });

builder.Services.AddAuthorization();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICustomerProfileRepository, CustomerProfileRepository>();
builder.Services.AddScoped<IOrderHistoryRepository, OrderHistoryRepository>();

// Services
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Validation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Controllers + API docs
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Auto-migrate database in development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs", options =>
    {
        options
            .WithTitle("SentraCX - CRM API")
            .WithTheme(ScalarTheme.BluePlanet)
            .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Fetch);
    });
}

app.UseHttpsRedirection();
// TODO: Re-enable authentication before production/merge to main
// app.UseAuthentication();
// app.UseMiddleware<JitProvisioningMiddleware>();
// app.UseAuthorization();
app.MapControllers();

app.Run();

// Make Program accessible to test project
public partial class Program { }
