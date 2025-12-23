from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import router as api_router
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(title=settings.project_name)

    # для обучения разрешим все источники (во фронте будем ходить с localhost)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/api")

    return app


app = create_app()


@app.on_event("startup")
def on_startup():
    # простое автосоздание таблиц без Alembic для учебного проекта
    Base.metadata.create_all(bind=engine)




