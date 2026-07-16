from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from scalar_fastapi import get_scalar_api_reference

app = FastAPI(
    title="SentraCX AI Analytics API",
    description="AI-powered analytics and insights service for SentraCX platform.",
    version="0.1.0",
    docs_url=None,  # Disable default Swagger UI
)


@app.get("/docs", include_in_schema=False)
async def scalar_docs():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )


@app.get("/health")
async def health_check():
    """Check the health status of the API."""
    return {"status": "healthy"}
