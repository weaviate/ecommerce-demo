import os

import weaviate
from dotenv import load_dotenv

load_dotenv()


def get_client():
    api_key_provider = {"X-OpenAI-Api-Key": os.environ.get("OPENAI_API_KEY")}

    if "dev" == os.environ.get("PROFILE"):
        return weaviate.connect_to_local(headers=api_key_provider)
    else:
        return weaviate.connect_to_wcs(
            cluster_url=os.environ.get("WCS_URL"),
            auth_credentials=weaviate.auth.AuthApiKey(os.environ.get("WCS_API_KEY")),
            headers=api_key_provider,
        )
