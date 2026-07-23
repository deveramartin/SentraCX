# Model Governance & Data Privacy Policy

This document defines the model lifecycle, retraining cadence, PII handling policies, and audited model inputs/outputs for the SentraCX AI-Analytics service.

---

## 1. Model Retraining Cadence

To prevent model drift and ensure recommendations remain accurate based on evolving customer behaviors, the following retraining schedules are defined:

| Model | Task | Cadence | Rationale / Trigger |
|---|---|---|---|
| **Churn Risk Model** | Predicts customer churn probability. | **Monthly** | Consumer behavior patterns change slowly but require updates based on monthly sales cycles. |
| **CLV Model** | Predicts customer lifetime value. | **Monthly** | Requires ingestion of historical purchase metrics from OOS. |
| **Next-Best-Action (NBA)** | Recommends next customer action. | **Quarterly** | Action taxonomies (promotions, outreach campaigns) change seasonally. |
| **Ticket Analyzer** | Sentiment, category, and urgency analysis. | **As Needed** | Heuristics and prompts are updated when customer support categories/KPIs evolve. |

---

## 2. PII Handling & Data Privacy Policy

### 2.1 PII Redaction for External APIs
When utilizing external LLM APIs (e.g., Groq API with `llama-3.1-8b-instant`), raw customer text must be redacted before transmission to prevent exposure of personally identifiable information (PII).

The automated `redact_pii()` helper intercepts conversation/ticket content and masks the following entities:
- **Email Addresses**: Replaced with `[EMAIL]`
- **Phone Numbers**: Replaced with `[PHONE]`
- **Credit Card Numbers**: Replaced with `[CREDIT_CARD]`
- **Social Security Numbers (SSN) / National IDs**: Replaced with `[SSN]`

### 2.2 Sensitivity & Role-Based Access (RBAC)
AI-derived customer insights (Churn Score, CLV, and Segmentation) are sensitive data points. Access is restricted at the frontend/API gateway layers based on roles:
- **Agents**: Can view Churn Score and Next-Best-Actions within the customer profile interface.
- **Managers / Admins**: Can view and modify CLV metrics, configure model thresholds, and view aggregate dashboard analytics.

---

## 3. Auditable Model Inputs & Outputs

### Churn Risk Model
- **Input Features**:
  - `days_since_last_order` (int)
  - `order_frequency_trend` (float)
  - `ticket_count_last_90d` (int)
  - `account_age_days` (int)
  - `total_orders` (int)
  - `total_order_value` (float)
  - `average_order_value` (float)
  - `order_frequency_per_month` (float)
- **Outputs**:
  - `churn_score` (float: 0.0 to 1.0)
  - `risk_level` (string: high, medium, low)

### Customer Lifetime Value (CLV) Model
- **Input Features**: Same as Churn Risk Model.
- **Outputs**:
  - `predicted_clv` (float)

### Next-Best-Action (NBA) Model
- **Input Features**: Customer features + computed churn score + computed CLV prediction.
- **Outputs**:
  - `action` (string: recommended action identifier)
  - `reason` (string: explanation)
  - `confidence` (float: 0.0 to 1.0)

### Ticket Analyzer (Sentiment & Category)
- **Input Features**:
  - Redacted customer conversation transcript / message text (string)
- **Outputs**:
  - `sentiment` (string: positive, negative, neutral)
  - `sentiment_score` (float: -1.0 to 1.0)
  - `predicted_category` (string: billing, technical, etc.)
  - `urgency_score` (float: 0.0 to 1.0)
  - `confidence` (float: 0.0 to 1.0)
  - `reasoning` (string)
