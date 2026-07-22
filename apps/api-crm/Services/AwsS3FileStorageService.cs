using Amazon.S3;
using Amazon.S3.Transfer;
using Crm.Api.Interfaces;

namespace Crm.Api.Services;

public class AwsS3FileStorageService : IFileStorageService
{
    private readonly string _bucketName;
    private readonly string _region;

    public AwsS3FileStorageService()
    {
        _bucketName = Environment.GetEnvironmentVariable("AWS_S3_BUCKET") ?? "sentracx-uploads";
        _region = Environment.GetEnvironmentVariable("AWS_S3_REGION") ?? "us-east-1";
    }

    public async Task<string> UploadAsync(IFormFile file, string folder)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty or null.", nameof(file));
        }

        var extension = Path.GetExtension(file.FileName);
        var key = $"{folder}/{Guid.NewGuid()}{extension}";

        using var client = new AmazonS3Client(Amazon.RegionEndpoint.GetBySystemName(_region));
        using var transferUtility = new TransferUtility(client);

        using var stream = file.OpenReadStream();
        await transferUtility.UploadAsync(stream, _bucketName, key);

        return $"https://{_bucketName}.s3.{_region}.amazonaws.com/{key}";
    }
}
