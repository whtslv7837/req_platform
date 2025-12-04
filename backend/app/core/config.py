from pydantic import BaseModel
import os


class Settings(BaseModel):
    project_name: str = "Employee Performance Platform (Edu)"
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://app:app@db:5432/app_db",
    )


settings = Settings()


