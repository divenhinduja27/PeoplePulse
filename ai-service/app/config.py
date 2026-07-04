import os
from dotenv import load_dotenv

# Get the path to the env files relative to this config file
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(base_dir, ".env")
example_path = os.path.join(base_dir, ".env.example")

# Load .env first
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)

# Fallback to loading from .env.example if GEMINI_API_KEY is not set
if not os.getenv("GEMINI_API_KEY") and os.path.exists(example_path):
    load_dotenv(dotenv_path=example_path)

class Config:
    """
    Configuration helper class to manage loaded environment variables
    for the attrition prediction microservice.
    """
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    @classmethod
    def verify_api_key(cls) -> None:
        """
        Validates the presence of GEMINI_API_KEY.
        Raises ValueError if key is absent or contains placeholder values.
        Only called when prediction/insight generation is triggered.
        """
        if not cls.GEMINI_API_KEY or cls.GEMINI_API_KEY.strip() in ("", "your_key_here"):
            raise ValueError(
                "GEMINI_API_KEY is not configured in the environment variables. "
                "Please add a valid API key from Google AI Studio to your .env file."
            )
