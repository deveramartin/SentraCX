from fastapi import FastAPI

app = FastAPI(
    title="SentraCX AI Analytics API",
    version="0.1.0",
)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
