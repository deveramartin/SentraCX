namespace Crm.Api.Helpers;

public static class EnvLoader
{
    public static void Load(string filePath = ".env")
    {
        if (!File.Exists(filePath))
            return;

        foreach (var line in File.ReadAllLines(filePath))
        {
            var trimmed = line.Trim();
            if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith('#'))
                continue;

            var separatorIndex = trimmed.IndexOf('=');
            if (separatorIndex <= 0)
                continue;

            var key = trimmed[..separatorIndex].Trim();
            var value = trimmed[(separatorIndex + 1)..].Trim();

            if (!string.IsNullOrEmpty(key))
                Environment.SetEnvironmentVariable(key, value);
        }
    }
}
