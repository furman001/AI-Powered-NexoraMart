from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "NexoraMart API"

    SUPABASE_URL: str
    SUPABASE_KEY: str

    SUPABASE_DB_USER: str = "postgres"
    SUPABASE_DB_PASSWORD: str
    SUPABASE_DB_HOST: str
    SUPABASE_DB_PORT: int = 5432
    SUPABASE_DB_NAME: str = "postgres"

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_sender_email: str = ""
    smtp_email_password: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()