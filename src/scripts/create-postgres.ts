import "dotenv/config";

import { execSync } from "child_process";

const { 
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_PASSWORD,
    CONTAINER_NAME
} = process.env;

if (!POSTGRES_USER || !POSTGRES_DB || !POSTGRES_PORT || !POSTGRES_PASSWORD || !CONTAINER_NAME) {
  console.error("❌ POSTGRES_USER, POSTGRES_DB, POSTGRES_PORT, POSTGRES_PASSWORD или CONTAINER_NAME не задан в .env");

  process.exit(1);
}

function runCommand(cmd: string) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch (err) {
    return "";
  }
}

const existing = runCommand(`docker ps -aq -f name=${CONTAINER_NAME}`);

if (existing) {
  console.log(`⚡ Контейнер ${CONTAINER_NAME} уже существует, перезапускаем...`);
  runCommand(`docker start ${CONTAINER_NAME}`);
} else {
  console.log(`🚀 Создаём и запускаем контейнер ${CONTAINER_NAME}...`);
  runCommand(
    `docker run -d --name ${CONTAINER_NAME} ` +
      `-e POSTGRES_USER=${POSTGRES_USER} ` +
      `-e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} ` +
      `-e POSTGRES_DB=${POSTGRES_DB} ` +
      `-p ${POSTGRES_PORT}:5432 ` +
      `-v pgdata:/var/lib/postgresql ` +
      `postgres:18`
  );
}

const status = runCommand(`docker ps -f name=${CONTAINER_NAME}`);

console.log("✅ Контейнер статус:");
console.log(status);
