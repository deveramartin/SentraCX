import {
  ChurnThresholdConfig,
  PriorityWeightsConfig,
  AnomalySensitivityConfig,
  ConfidenceThresholdsConfig,
} from "@/types/config";

const AI_BASE = process.env.NEXT_PUBLIC_AI_API_URL ?? "http://localhost:4005";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${AI_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `AI API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        errorMessage = Array.isArray(errorData.detail)
          ? errorData.detail.map((d: any) => d.msg).join(", ")
          : errorData.detail;
      }
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const aiClient = {
  config: {
    getChurnThreshold: () =>
      request<ChurnThresholdConfig>("/api/v1/config/churn-threshold"),
    updateChurnThreshold: (body: ChurnThresholdConfig) =>
      request<ChurnThresholdConfig>("/api/v1/config/churn-threshold", {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    getPriorityWeights: () =>
      request<PriorityWeightsConfig>("/api/v1/config/priority-weights"),
    updatePriorityWeights: (body: PriorityWeightsConfig) =>
      request<PriorityWeightsConfig>("/api/v1/config/priority-weights", {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    getAnomalySensitivity: () =>
      request<AnomalySensitivityConfig>("/api/v1/config/anomaly-sensitivity"),
    updateAnomalySensitivity: (body: AnomalySensitivityConfig) =>
      request<AnomalySensitivityConfig>("/api/v1/config/anomaly-sensitivity", {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    getConfidenceThresholds: () =>
      request<ConfidenceThresholdsConfig>("/api/v1/config/confidence-thresholds"),
    updateConfidenceThresholds: (body: ConfidenceThresholdsConfig) =>
      request<ConfidenceThresholdsConfig>("/api/v1/config/confidence-thresholds", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },
};
