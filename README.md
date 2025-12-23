## Учебный проект: Платформа оценки эффективности сотрудников

Стек:
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **БД**: PostgreSQL
- **Frontend**: React + TypeScript
- **Инфраструктура**: Docker, Docker Compose

Функционал (минимальный учебный):
- **Сотрудники**: создание, список, просмотр
- **Цели/задачи (Goals)**: постановка целей сотруднику
- **Оценки (Reviews)**: хранение оценок и комментариев от менеджера

### Запуск через Docker

```bash
docker compose up --build
```

Backend будет доступен по адресу `http://localhost:8000`, frontend — по адресу `http://localhost:5173` (или порту, указанному в `docker-compose.yml`).

### Структура (основное)

- backend/ — FastAPI приложение
- frontend/ — React приложение
- docker-compose.yml — запуск всех сервисов




