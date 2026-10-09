# TrustLine

**Verified Support Routing System — prototype.** TrustLine is a support-resource discovery app that uses a user's query and available location context to look up helplines and related resources from backend data sources.

TrustLine is not an emergency dispatcher, and it does not guarantee that every listed resource is current, available, independently verified, or appropriate for every situation. Coverage and data quality depend on the records loaded into the application.

## Project status and trust boundaries

- **Contact data comes from backend sources.** The app looks up India records in PostgreSQL, global records in an imported cache, and code-maintained fallbacks when a lookup returns no records.
- **AI supports understanding and reply formatting.** A local multilingual Sentence Transformers model classifies the support category. Groq attempts to extract location, urgency, and language, and generates a short natural-language reply.
- **The model is instructed not to invent contact details.** The response formatter is not supplied the normal resource phone/name fields as resource context and is prompted not to provide contact details. This reduces risk; it is not a guarantee that every output or database record is correct.
- **“Verified” is not a live-check guarantee.** The global importer preserves upstream metadata, including verification status when present. The current UI can also show the badge for India records based on a heuristic. Neither the badge nor the import process proves a number was independently checked or remains active.
- **Queries are logged.** The backend stores the full submitted query text in QueryLog, along with category, urgency, country, location metadata, and timestamp. ChatSession stores category/location slug metadata. This implementation should not be described as stateless or as storing no query data.
- **Coverage is not uniform.** India coverage depends on records loaded into the Helpline table. The global importer maps only selected categories from one upstream dataset. Some fallback responses are generic and may not contain a phone number.

Avoid submitting unnecessary personal or identifying information. Before production use, resource records, fallback data, privacy/retention practices, and verification-badge logic need review.

## Request flow

1. The user describes the situation in the chat.
2. The local multilingual Sentence Transformers model classifies the support category.
3. Groq attempts to extract urgency, language, and location; Pydantic validates the result. If Groq is rate-limited or fails, fallback paths are used, but location or urgency extraction may be incomplete.
4. If the extracted result has no country, the backend uses the supplied country dropdown value, then a supplied browser-geolocation result, and finally defaults to India.
5. The backend queries the India Helpline table or global resource cache, based on the resolved country.
6. If no resources are returned, the backend checks the hardcoded fallback registry. Depending on the country/category, this may return a specific configured resource or a general fallback without a phone number.
7. Resource text is localized when possible, Groq formats a short reply, the backend logs the query, and a category/location slug is created or reused.

Resource cards and the generated reply are separate: contact fields come from returned data records, while the reply is generated text and must not be treated as an authoritative source for contact information.

## Location handling

When the frontend does not detect a location-like phrase and the user has not selected a country, it can request browser geolocation after the user sends a message. If permission is granted, the browser coordinates are reverse-geocoded through OpenStreetMap Nominatim into country/state/district fields; the resulting administrative location is sent to the backend, not the raw coordinates.

The frontend uses a simple text heuristic to avoid requesting geolocation when a query appears to contain a location. It is not a complete place-name parser. Location extraction by the model is also best-effort.

When the extracted result does not contain a country, backend priority is:
1. Country selected in the UI and sent with the request.
2. Country supplied by browser geolocation.
3. Default country: India.

If the model successfully extracts a country from the query, that value is used instead of these fallbacks. State or district extraction may still be absent or incorrect, so district-level coverage must not be assumed.

## Data sources and lookup behaviour

### India

India resources are stored in PostgreSQL's Helpline table. Records include fields such as category, country, optional state/district, name, phone, source URL, verifier text, last-verified date, availability, and priority. Lookup uses country/category and applies state/district filters when those values are available; rows with no state/district can also match.

The code does not independently validate every record against an authority at request time. Result quality and completeness depend on the records entered and maintained in the database.

### Global resources

The Django management command named import_global_data imports data from the public world-emergency-hotlines GitHub dataset and maps selected upstream categories into TrustLine categories. It stores country/category groups in GlobalResourceCache and preserves upstream fields in the raw records.

Important limitations:
- Importing the dataset does **not** independently verify the truth, freshness, or availability of each number.
- Only categories mapped by the import command are imported; not every TrustLine category is available for every country.
- Live external lookup is **not implemented**: the external-fetch function currently returns None.
- If no unexpired cache row is found, runtime lookup may return the most recently fetched stale row. Cached data can therefore be older than its expiry.
- The importer sets a 30-day expiry value, but expiry does not guarantee that a record is revalidated or removed.

### Hardcoded fallbacks

Fallback records are maintained in **backend/core/fallbacks.py**. They are not live-checked against official sources. Some country/category pairs have specific entries; others use a country default or a generic “contact local emergency services” response. A generic fallback may have no phone number.

Treat this registry as data requiring manual review, not as a globally complete or automatically verified emergency directory. Do not describe all fallback entries as verified.

## Architecture and stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS.
- **Backend/API:** Django and Django REST Framework.
- **Database:** PostgreSQL.
- **Category classification:** paraphrase-multilingual-MiniLM-L12-v2 via Sentence Transformers, with keyword-based handling for some ambiguous/fallback cases.
- **LLM:** Groq API using openai/gpt-oss-120b in the current backend code for metadata extraction and response formatting. The model name is hardcoded in backend/core/groq_client.py.
- **Validation:** Pydantic schema for extracted metadata.
- **Translation:** Google Cloud Translation API is attempted first; Argos Translate is used as a per-string fallback when an installed language pair is available. If translation fails, original text may be retained.
- **Browser location:** Geolocation API and OpenStreetMap Nominatim reverse geocoding.

## Safety, reliability, and privacy

- **API throttling:** Django REST Framework anonymous throttling is configured at 20 requests per minute. A separate process-local limiter allows up to 30 classification/extraction attempts per 60 seconds before the Groq metadata-extraction step falls back. This is basic throttling, not a distributed or production-grade abuse-prevention system.
- **Failure handling:** JSON/schema errors and Groq exceptions have fallback paths, but may reduce the quality or specificity of extracted urgency/location data.
- **Verification badges:** The frontend accepts certain upstream verification-status values, but it also treats some India records as verified through a country/field heuristic. Audit this rule and the data before treating a badge as proof of independent verification.
- **Data retention:** Full query text is written to QueryLog. The repository does not document an automated retention/deletion policy for these rows.
- **CORS:** Current Django settings allow all CORS origins for testing. Restrict this before production deployment.
- **Emergency use:** TrustLine does not dispatch emergency services. In immediate danger, contact the appropriate local emergency service instead of waiting for an app response.

## Routes and API endpoints

The frontend uses the Next.js App Router under **frontend/src/app**. The current interface includes the landing page, a dedicated About page, chat, category/location slug pages, and information/legal pages.

Backend routes are mounted under /api/:

| Endpoint | Method | Purpose |
|---|---|---|
| /api/chat/ | POST | Classify a query, look up resources, format a reply, log the query, and return a slug |
| /api/chat/<slug>/ | GET | Rebuild a resource response from stored category/location metadata; not an exact replay of a stored conversation |
| /api/helplines/ | GET | Paginated India Helpline records, optionally filtered by state/category |
| /api/sitemap-data/ | GET | Return stored category/location slugs and creation timestamps |
| /api/translate-ui/ | POST | Translate a list of UI text strings |

### Chat request shape

The chat endpoint accepts a query and optional location signals. Example shape:

    {
      "query": "I need legal help",
      "dropdown_country": "India",
      "geo_location": {
        "country": "India",
        "state": "Uttar Pradesh",
        "district": "Lucknow"
      }
    }

The response includes the submitted query, extracted metadata, a resources array, generated guidance text, and a slug. Resource fields vary according to whether a record came from the India database, global cache, or fallback registry. This example does not imply that every request will find a matching Lucknow resource.

## Local development setup

### Prerequisites

- Python and a working PostgreSQL instance.
- Node.js/npm compatible with the version in frontend/package.json.
- A Groq API key.
- A Google Cloud Translation API key. The current backend translator reads GOOGLE_TRANSLATE_API_KEY from the environment at import time.
- The root requirements.txt does not list every imported runtime package; the backend also imports sentence-transformers and argostranslate.

### Backend

From the repository root:

    cd backend
    python -m venv venv

Windows PowerShell:

    .\venv\Scripts\Activate.ps1

macOS/Linux:

    source venv/bin/activate

Install the root requirements and the currently missing direct imports:

    pip install -r ..\requirements.txt
    pip install sentence-transformers argostranslate

Create **backend/.env**:

    SECRET_KEY=replace_with_a_long_random_secret
    DEBUG=True
    ALLOWED_HOSTS=localhost,127.0.0.1
    DB_NAME=trustline_db
    DB_USER=postgres
    DB_PASSWORD=replace_with_your_postgres_password
    GROQ_API_KEY=your_groq_api_key
    GOOGLE_TRANSLATE_API_KEY=your_google_translation_api_key

Create the PostgreSQL database before running migrations, and ensure its credentials match the environment file. Then, from backend/:

    python manage.py migrate
    python manage.py createsuperuser
    python manage.py import_global_data
    python manage.py runserver

The global import requires outbound internet access. Review imported records and source metadata before presenting them to users.

### Frontend

In a second terminal:

    cd frontend
    npm install

Create **frontend/.env.local**:

    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

Run the development server:

    npm run dev

Open http://localhost:3000. The theme follows the operating system preference by default; a manually chosen theme is stored in the browser and takes precedence.

For deployment, set NEXT_PUBLIC_API_URL to the deployed API origin and configure Django hosts, CORS, secrets, database access, and rate limiting appropriately. Do not use DEBUG=True or permissive CORS settings for production.

## Current limitations and next steps

- Verify each fallback against an official source and record its source URL and verification date.
- Review the Verified badge rule so the UI distinguishes upstream metadata from records independently checked by the project.
- Expand and document India database coverage; code alone does not prove the table's current data completeness.
- Add freshness monitoring and a defined policy for stale global-cache records.
- Implement a real global provider integration if live data is required; the current external-fetch function is a stub.
- Define query-log retention/deletion and review privacy statements against actual database behaviour.
- Add automated tests for location precedence, category classification, cache expiry/stale fallback, and the response shape.

## Project structure

    trustline/
    ├── Readme.md
    ├── requirements.txt
    ├── backend/
    │   ├── config/                 # Django settings and root URLs
    │   ├── core/
    │   │   ├── models.py           # Helpline, QueryLog, GlobalResourceCache, ChatSession
    │   │   ├── views.py            # Chat/resource/session/API views
    │   │   ├── groq_client.py      # Groq extraction and reply formatting
    │   │   ├── intent_classifier.py
    │   │   ├── fallback_classifier.py
    │   │   ├── global_client.py    # Global cache lookup and fetch stub
    │   │   ├── fallbacks.py        # Code-maintained fallback records
    │   │   ├── rate_limiter.py
    │   │   └── management/commands/import_global_data.py
    │   └── manage.py
    └── frontend/
        └── src/
            ├── app/                # App Router pages and metadata routes
            ├── components/         # Shared UI and landing-v2 components
            ├── screens/            # Chat and shared page screens
            └── lib/                # API client, language and app utilities

## Disclaimer

TrustLine is a support-resource discovery prototype, not an emergency service or a guarantee of verified/current contact information. Data may be incomplete, stale, misclassified, or unavailable. Verify critical contact details through the relevant official source where possible. In immediate danger, contact local emergency services directly.
