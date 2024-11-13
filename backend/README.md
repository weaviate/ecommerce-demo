# Ecommerce Demo - Backend

## Running

Make sure to create a ```.env``` file in the root of this project.
Ask the team for credentials.

Possible Environemnt Variables:

```
PROVIDER="openai" or "cohere"

OPENAI_API_KEY="openai_api_key"

PROFILE="dev" or None

WCS_URL="url_to_wcs_cluster"

WCS_API_KEY="wcs_cluster_api_key""
```

Start with:

```uvicorn main:app --reload```

## Files:

### ```main.py```

FastAPI main entrypoint

### ```models.py```

Contains all Pydantic models used

### ```indexer.py```:

Has a main function to kick off a complete indexing run based on data in CSV
Also is connected to ```/index``` when running the main app

### ```searcher.py```

Has a main function to kick off a search request
Also is connected to ```/search``` when running the main app