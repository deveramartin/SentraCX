# PROJECT MANAGEMENT

## WEEK 3 DELIVERABLES
**SentraCX Analytics & Predictive Enhancement**

---

## DELIVERABLE 3: DATA VALIDATION REPORT

### 3.1 Report Overview

| Attribute | Details |
|---|---|
| **Report Date** | July 17, 2026 |
| **Extraction Mechanism** | Real-Time REST API Integration (`CustomerInsightsService`) |
| **Database Source** | SentraCX PostgreSQL (CRM via API) |
| **Target Database** | SentraCX MongoDB (AI-Analytics feature log) & Redis (Cache) |

### 3.2 Executive Summary

Unlike a traditional batch ETL pipeline, the SentraCX architecture performs data extraction on-the-fly. Validation ensures that the `CustomerInsightsService` correctly pulls data from the CRM API, safely handles missing fields, builds the exact feature vector required by the ML models, and logs it successfully to MongoDB.

Data validation confirmed:
1. **API Integration**: CRM API connects successfully and returns standardized Customer and Order data.
2. **Feature Engineering Validation**: Time-series calculations (e.g., `account_age_days`, `days_since_last_order`) calculate accurately even when date fields are missing or malformed.
3. **Data Quality Issues Addressed**: Missing numeric values default to `0.0`. Bad date strings are cleanly caught by `try/except` blocks without crashing the request.
4. **Caching Verification**: Once insights are computed, they are successfully stored and retrieved from Redis, bypassing the CRM API on subsequent requests.

### 3.3 Feature Vector Validation (Unit Level)

This table shows how raw CRM data payloads are transformed into the `CustomerFeatures` vector, validating data quality handling.

| CRM Field (Raw API Payload) | Transformation Logic (`_build_features`) | Validation Status |
|---|---|---|
| `createdAt` (e.g., `2024-01-01T00:00:00Z`) | Parsed via `fromisoformat`, subtracted from `now()` to get `account_age_days`. | ✅ Passed |
| `createdAt` (Missing / `null`) | Caught by `if created_at:`. Defaults `account_age_days` to `0`. | ✅ Passed |
| `totalAmount` (Missing / `null`) | Caught by `order.get(...) or 0`. Defaults to `0.0`. | ✅ Passed |
| `orderDate` (Malformed string) | Caught by `except (ValueError, TypeError)`. Discarded safely. | ✅ Passed |

### 3.4 System Flow Validation (End-to-End)

**Scenario 1: Cold Start (No Cache)**

| Step | Component | Result | Status |
|---|---|---|---|
| **Extract** | CRM API | Successfully fetched Customer + 3 Orders. | ✅ |
| **Transform** | `CustomerInsightsService` | `total_order_value` calculated correctly. | ✅ |
| **Predict** | ML Models | `churn_score` and `clv_prediction` generated. | ✅ |
| **Load (Cache)** | Redis | Wrote JSON payload to `cache:customer:{id}:insights`. | ✅ |
| **Load (Log)** | MongoDB | Wrote `CustomerFeatures` to `feature_logs` collection. | ✅ |

**Scenario 2: Cache Hit**

| Step | Component | Result | Status |
|---|---|---|---|
| **Check Cache** | Redis | Found `cache:customer:{id}:insights`. | ✅ |
| **Bypass Extract** | CRM API | Call bypassed. | ✅ |
| **Return** | FastAPI | Returned cached `CustomerInsightsResponse`. | ✅ |

### 3.5 AI Prediction Architecture Summary

| Metric | Value |
|---|---|
| **Churn Model Inputs** | `days_since_last_order`, `ticket_count_last_90d`, `account_age_days` |
| **CLV Model Inputs** | `total_orders`, `average_order_value`, `order_frequency_per_month` |
| **Caching Strategy** | Write-through cache to Redis |
| **Observability** | All inputs logged to MongoDB for model drift analysis |

### 3.6 Conclusion

- ✅ **Data Extraction & API Status:** PASSED
- ✅ **Feature Engineering & Transformation:** PASSED
- ✅ **Polyglot Storage (Redis/Mongo) Status:** PASSED
- ✅ **Overall Status:** READY FOR PRODUCTION
