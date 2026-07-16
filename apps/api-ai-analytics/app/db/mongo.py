"""MongoDB async client setup and lifecycle."""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def connect_mongo(uri: str, database: str) -> None:
    """Initialize MongoDB connection."""
    global _client, _database
    _client = AsyncIOMotorClient(uri)
    _database = _client[database]
    # Verify connection
    await _client.admin.command("ping")


async def close_mongo() -> None:
    """Close MongoDB connection."""
    global _client, _database
    if _client:
        _client.close()
        _client = None
        _database = None


def get_database() -> AsyncIOMotorDatabase:
    """Get the MongoDB database instance.

    Raises RuntimeError if called before connect_mongo().
    """
    if _database is None:
        raise RuntimeError("MongoDB not initialized. Call connect_mongo() first.")
    return _database
