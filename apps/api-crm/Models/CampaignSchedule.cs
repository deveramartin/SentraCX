namespace Crm.Api.Models;

public class CampaignSchedule
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public string ScheduleType { get; set; } = string.Empty; // SendNow, Scheduled, Recurring
    public List<string>? RecurrenceDays { get; set; } // Array of Days (Monday...Sunday)
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? NextRunAt { get; set; }

    // Navigation properties
    public Campaign Campaign { get; set; } = null!;
}
