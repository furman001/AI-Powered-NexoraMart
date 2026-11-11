# Milestone 0, Part 1: changes that need no database

Tests: 33 pass. 1 integration file (`tests/test_api_security.py`) is written but
was not run, because FastAPI could not be installed where I worked. Run it
yourself with `pip install -r requirements-dev.txt` then `python -m pytest tests -v`.

## Where each file goes

`backend/` below means the folder that contains your `app/`, `sql/` and `requirements.txt`.
`admin-panel/` means the folder that contains your `package.json`.

| File | New or changed | What it does |
| --- | --- | --- |
| backend/.gitignore | changed (was empty) | Stops `.env`, caches and virtual environments being committed |
| backend/.env.example | new | Template listing every setting, no real values |
| backend/requirements.txt | changed | Adds `psycopg2-binary`, which `database.py` already needs |
| backend/requirements-dev.txt | new | Test tools: pytest, httpx |
| backend/app/core/config.py | changed | New settings: ENVIRONMENT, CORS_ORIGINS, LOG_LEVEL, TRUST_PROXY_HEADERS, RATE_LIMIT_ENABLED |
| backend/app/core/rate_limit.py | new | Per-IP rate limiting |
| backend/app/core/logging_config.py | new | JSON logs with request IDs, no personal data |
| backend/app/main.py | changed | CORS and environment from settings, request-ID logging, real /health environment |
| backend/app/utils/upload_validation.py | new | Image and video type, content and size checks |
| backend/app/api/v1/routes/uploads.py | changed | Uses the validation above |
| backend/app/api/v1/routes/auth.py | changed | Login limited to 10 attempts per 10 minutes per IP |
| backend/app/api/v1/routes/orders.py | changed | Rate limits on order create, tracking, phone lookup and cancel. Order logic is NOT changed yet |
| backend/app/api/v1/routes/reviews.py | changed | 5 reviews per 10 minutes per IP |
| backend/app/schemas/review.py | changed | Name max 100, comment max 1000, whitespace trimmed |
| backend/test_db.py | changed | No hard-coded user or host, reads .env |
| backend/check_env.py | changed | Works with the real setting names, prints no values |
| backend/check_supabase_env.py | DELETE | Duplicate of check_env.py using setting names that do not exist |
| backend/tests/ (whole folder) | new | Test suite |
| admin-panel/.gitignore | changed | Also ignores `.env` files |
| admin-panel/.env.example | new | Template for `VITE_API_BASE_URL` |

## New settings to add to your .env (all optional, defaults shown)

    ENVIRONMENT=development
    CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
    LOG_LEVEL=INFO
    TRUST_PROXY_HEADERS=false
    RATE_LIMIT_ENABLED=true

When you deploy, set ENVIRONMENT=production and put your real site address in CORS_ORIGINS.

## Known limits of this part
- Rate-limit counters live in the running process. Several workers each count separately.
- Behind a reverse proxy, turn on TRUST_PROXY_HEADERS only if the proxy sets X-Forwarded-For.
- Customers on mobile data can share an IP, so shopping limits are generous.
- Admin image upload now rejects non-images and files over 5 MB (video: 50 MB).
