#!/usr/bin/env bash
set -euo pipefail

# Скрипт для полной очистки БД (удаление volume) и перезапуска docker-compose

PROJECT_ROOT="/home/whtslv/recrut_platform"

cd "$PROJECT_ROOT"

echo "[reset_db] Останавливаю контейнеры и удаляю volume с БД..."
docker compose down -v

echo "[reset_db] Запускаю стек заново..."
docker compose up --build -d

echo "[reset_db] Готово. Чистая БД и запущенные сервисы."



