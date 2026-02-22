from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ADMIN_DATABASE_URL: str
    model_config = {
        "env_file": ".env",
        "extra": "allow"
    }

settings = Settings()