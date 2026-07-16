# Manual Testing — AI-Analytics API

How to manually test the Customer Insights endpoint and verify everything works end-to-end.

---

## Prerequisites

1. **MongoDB** running on `localhost:27017`
2. **Redis** running on `localhost:6379`
3. **CRM API** running on `localhost:5005` (needed for real customer data)

Start the databases:

```bash
# Redis (Homebrew service — auto-restarts on login)
brew services start redis

# MongoDB (local binary at ~/.local/bin/mongod)
mongod --dbpath ~/.local/share/mongodb/data \
       --logpath ~/.local/share/mongodb/log/mongod.log \
       --fork --port 27017
```

Verify they're running:

```bash
redis-cli ping                              # Should print PONG
mongosh --eval "db.runCommand({ping:1})"   # Should print { ok: 1 }
```

---

## 1. Start the AI-Analytics service

```bash
cd apps/api-ai-analytics

# Ensure .env.local is populated (see .env.local comments for where to get values)

# Activate venv and start
source .venv/bin/activate
uvicorn app.main:app --reload --port 4005
```

Or from the monorepo root:

```bash
pnpm dev:ai
```

You should see:

```
INFO:     Connecting to MongoDB at mongodb://localhost:27017
INFO:     MongoDB connected
INFO:     Connecting to Redis at redis://localhost:6379/0
INFO:     Redis connected
INFO:     Uvicorn running on http://0.0.0.0:4005
```

---

## 2. Verify health

```bash
curl http://localhost:4005/health
```

Expected:

```json
{"status": "healthy"}
```

---

## 3. View API documentation

Open in browser: **http://localhost:4005/docs**

This shows the Scalar API Reference with all endpoints, schemas, and try-it-out functionality.

---

## 4. Test Customer Insights endpoint

### With CRM running (full flow)

Start the CRM API first:

```bash
cd apps/api-crm && dotnet run
```

Then find a valid customer ID. The CRM uses GUIDs. List customers:

```bash
curl http://localhost:5005/api/v1/customers
```

Pick a customer ID from the response and call insights:

```bash
curl -s http://localhost:4005/api/v1/customers/{customer_id}/insights | python -m json.tool
```

Expected response (200 OK):

```json
{
    "customer_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "churn_score": 0.25,
    "clv_prediction": 1250.50,
    "next_best_action": {
        "action": "send_product_recommendations",
        "reason": "Customer inactive but not yet at high churn risk",
        "confidence": 0.65
    },
    "computed_at": "2026-07-17T06:00:00Z",
    "cached": false
}
```

### Without CRM running (expected error)

If the CRM API is not running, you'll get a 404 (the CRM client returns None when it can't
reach the service, which the service interprets as "customer not found"):

```bash
curl -s http://localhost:4005/api/v1/customers/any-id/insights
```

Response (404):

```json
{
    "detail": "Customer any-id not found in CRM"
}
```

---

## 5. Test caching behavior

Call the same customer twice:

```bash
# First call — computes fresh
curl -s http://localhost:4005/api/v1/customers/{id}/insights | python -m json.tool
# Note: "cached": false

# Second call — served from Redis cache
curl -s http://localhost:4005/api/v1/customers/{id}/insights | python -m json.tool
# Note: "cached": true
```

To verify Redis has the cache entry:

```bash
redis-cli GET "customer:{id}:insights"
```

To clear cache and force recompute:

```bash
redis-cli DEL "customer:{id}:insights"
```

---

## 6. Verify MongoDB feature logs

After a successful insights call, a feature snapshot is stored in MongoDB:

```bash
mongosh sentracx_analytics --eval "db.customer_feature_logs.find().sort({recorded_at: -1}).limit(1).pretty()"
```

Expected document:

```json
{
    "_id": ObjectId("..."),
    "customer_id": "3fa85f64-...",
    "features": {
        "customer_id": "3fa85f64-...",
        "days_since_last_order": 45,
        "order_frequency_trend": 0.0,
        "ticket_count_last_90d": 2,
        "account_age_days": 180,
        "total_orders": 5,
        "total_order_value": 450.00,
        "average_order_value": 90.00,
        "order_frequency_per_month": 0.83
    },
    "recorded_at": ISODate("2026-07-17T...")
}
```

---

## 7. Test error scenarios

### Customer not found (404)

```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:4005/api/v1/customers/nonexistent-id/insights
```

### Invalid route (404)

```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:4005/api/v1/customers/
```

---

## 8. Run automated tests (no external services needed)

All 77 automated tests run with mocked infrastructure — no MongoDB, Redis, or CRM needed:

```bash
cd apps/api-ai-analytics
source .venv/bin/activate
python -m pytest tests/ -v
```

For coverage:

```bash
python -m pytest tests/ --cov=app --cov-report=term-missing
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `RuntimeError: MongoDB not initialized` | MongoDB unreachable on startup | Start it: `mongod --dbpath ~/.local/share/mongodb/data --logpath ~/.local/share/mongodb/log/mongod.log --fork` |
| `RuntimeError: Redis not initialized` | Redis unreachable on startup | `redis-cli ping` — if no PONG, run `brew services start redis` |
| All calls return 404 | CRM API not running or wrong URL | Start CRM: `cd apps/api-crm && dotnet run`, check `CRM_API_BASE_URL` |
| `ModuleNotFoundError` | Dependencies not installed | Run `pip install -e ".[dev]"` in the venv |
| Port 4005 already in use | Another process on that port | `lsof -i :4005` and kill, or change `APP_PORT` in `.env.local` |
