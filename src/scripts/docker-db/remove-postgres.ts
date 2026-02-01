import { execSync } from "child_process";

const { DB_CONTAINER, DB_VOLUME } = process.env;

if (!DB_CONTAINER || !DB_VOLUME) {
  console.error("❌ CONTAINER_NAME или VOLUME_NAME не задан в .env");

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
  console.log(`⚡ Останавливаем контейнер ${DB_CONTAINER}...`);
  runCommand(`docker stop ${DB_CONTAINER}`);

  console.log(`🗑 Удаляем контейнер ${DB_CONTAINER}...`);
  runCommand(`docker rm ${DB_CONTAINER}`);
} else {
  console.log(`❌ Контейнер ${DB_CONTAINER} не найден`);
}

const volumeExists = runCommand(`docker volume ls -q -f name=${DB_VOLUME}`);

if (volumeExists) {
  console.log(`🗑 Удаляем volume ${DB_VOLUME}...`);
  runCommand(`docker volume rm ${DB_VOLUME}`);
} else {
  console.log(`❌ Volume ${DB_VOLUME} не найден`);
}

console.log("✅ Удаление контейнера и volume завершено");