import "dotenv/config";

import { execSync } from "child_process";

const { 
    DB_NAME,
    DB_USER,
    DB_PORT,
    DB_PASSWORD,
    DB_CONTAINER,
} = process.env;

if (!DB_USER || !DB_NAME || !DB_PORT || !DB_PASSWORD || !DB_CONTAINER) {
  console.error("❌ DB_USER, DB_NAME, DB_PORT, DB_PASSWORD или DB_CONTAINER не задан в .env");

  process.exit(1);
}

function runCommand(cmd: string) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch (err) {
    return "";
  }
}

const existing = runCommand(`docker ps -aq -f name=${DB_CONTAINER}`);

if (existing) {
  console.log(`⚡ Контейнер ${DB_CONTAINER} уже существует, перезапускаем...`);
  runCommand(`docker start ${DB_CONTAINER}`);
} else {
  console.log(`🚀 Создаём и запускаем контейнер ${DB_CONTAINER}...`);
  runCommand(
    `docker run -d --name ${DB_CONTAINER} ` +
      `-e POSTGRES_USER=${DB_USER} ` +
      `-e POSTGRES_PASSWORD=${DB_PASSWORD} ` +
      `-e POSTGRES_DB=${DB_NAME} ` +
      `-p ${DB_PORT}:5432 ` +
      `-v pgdata:/var/lib/postgresql ` +
      `postgres:18`
  );
}

const status = runCommand(`docker ps -f name=${DB_CONTAINER}`);

console.log("✅ Контейнер статус:");
console.log(status);
