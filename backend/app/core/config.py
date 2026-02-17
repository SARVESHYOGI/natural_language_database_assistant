from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    MODEL_NAME: str = "mistralai/Mistral-7B-Instruct-v0.2"

    model_config = {
        "env_file": ".env",
        "extra": "allow"
    }

settings = Settings()
