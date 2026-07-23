"""AI Configuration API routes."""

from fastapi import APIRouter, Depends, Header
from app.api.v1.deps import get_config_service
from app.services.config_service import ConfigService
from app.schemas.config_schemas import (
    ChurnThresholdConfig,
    PriorityWeightsConfig,
    AnomalySensitivityConfig,
    ConfidenceThresholdsConfig,
)

router = APIRouter(prefix="/config", tags=["config"])


@router.get(
    "/churn-threshold",
    response_model=ChurnThresholdConfig,
    summary="Get churn threshold config",
)
async def get_churn_threshold(
    service: ConfigService = Depends(get_config_service),
) -> ChurnThresholdConfig:
    """Retrieve the current churn threshold configuration."""
    config = await service.get_config("churn-threshold")
    return ChurnThresholdConfig(**config)


@router.put(
    "/churn-threshold",
    response_model=ChurnThresholdConfig,
    summary="Update churn threshold config",
)
async def update_churn_threshold(
    config: ChurnThresholdConfig,
    x_user_email: str | None = Header(default="admin", alias="X-User-Email"),
    service: ConfigService = Depends(get_config_service),
) -> ChurnThresholdConfig:
    """Update the churn threshold configuration and record in audit log."""
    updated = await service.update_config(
        key="churn-threshold",
        value=config.model_dump(),
        changed_by=x_user_email or "admin",
    )
    return ChurnThresholdConfig(**updated)


@router.get(
    "/priority-weights",
    response_model=PriorityWeightsConfig,
    summary="Get ticket priority weights config",
)
async def get_priority_weights(
    service: ConfigService = Depends(get_config_service),
) -> PriorityWeightsConfig:
    """Retrieve the current ticket priority weighting configuration."""
    config = await service.get_config("priority-weights")
    return PriorityWeightsConfig(**config)


@router.put(
    "/priority-weights",
    response_model=PriorityWeightsConfig,
    summary="Update ticket priority weights config",
)
async def update_priority_weights(
    config: PriorityWeightsConfig,
    x_user_email: str | None = Header(default="admin", alias="X-User-Email"),
    service: ConfigService = Depends(get_config_service),
) -> PriorityWeightsConfig:
    """Update the ticket priority weighting configuration and record in audit log."""
    updated = await service.update_config(
        key="priority-weights",
        value=config.model_dump(),
        changed_by=x_user_email or "admin",
    )
    return PriorityWeightsConfig(**updated)


@router.get(
    "/anomaly-sensitivity",
    response_model=AnomalySensitivityConfig,
    summary="Get anomaly detection sensitivity config",
)
async def get_anomaly_sensitivity(
    service: ConfigService = Depends(get_config_service),
) -> AnomalySensitivityConfig:
    """Retrieve the current anomaly detection sensitivity configuration."""
    config = await service.get_config("anomaly-sensitivity")
    return AnomalySensitivityConfig(**config)


@router.put(
    "/anomaly-sensitivity",
    response_model=AnomalySensitivityConfig,
    summary="Update anomaly detection sensitivity config",
)
async def update_anomaly_sensitivity(
    config: AnomalySensitivityConfig,
    x_user_email: str | None = Header(default="admin", alias="X-User-Email"),
    service: ConfigService = Depends(get_config_service),
) -> AnomalySensitivityConfig:
    """Update the anomaly detection sensitivity configuration and record in audit log."""
    updated = await service.update_config(
        key="anomaly-sensitivity",
        value=config.model_dump(),
        changed_by=x_user_email or "admin",
    )
    return AnomalySensitivityConfig(**updated)


@router.get(
    "/confidence-thresholds",
    response_model=ConfidenceThresholdsConfig,
    summary="Get model confidence thresholds config",
)
async def get_confidence_thresholds(
    service: ConfigService = Depends(get_config_service),
) -> ConfidenceThresholdsConfig:
    """Retrieve the current model confidence thresholds configuration."""
    config = await service.get_config("confidence-thresholds")
    return ConfidenceThresholdsConfig(**config)


@router.put(
    "/confidence-thresholds",
    response_model=ConfidenceThresholdsConfig,
    summary="Update model confidence thresholds config",
)
async def update_confidence_thresholds(
    config: ConfidenceThresholdsConfig,
    x_user_email: str | None = Header(default="admin", alias="X-User-Email"),
    service: ConfigService = Depends(get_config_service),
) -> ConfidenceThresholdsConfig:
    """Update the model confidence thresholds configuration and record in audit log."""
    updated = await service.update_config(
        key="confidence-thresholds",
        value=config.model_dump(),
        changed_by=x_user_email or "admin",
    )
    return ConfidenceThresholdsConfig(**updated)
