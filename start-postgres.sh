#!/usr/bin/env bash
set -e

# Подгружаем env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Имя контейнера
CONTAINER_NAME=ses1-data-postgres

# Проверяем, есть ли уже контейнер
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Контейнер $CONTAINER_NAME уже существует, перезапускаем..."
    docker start $CONTAINER_NAME
else
    echo "Создаём и запускаем контейнер $CONTAINER_NAME..."
    docker run -d \
      --name $CONTAINER_NAME \
      -e POSTGRES_USER=$POSTGRES_USER \
      -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
      -e POSTGRES_DB=$POSTGRES_DB \
      -p ${POSTGRES_PORT:-5432}:5432 \
      -v pgdata:/var/lib/postgresql \
      postgres:18
fi

echo "Готово! Проверим статус:"
docker ps -f name=$CONTAINER_NAME