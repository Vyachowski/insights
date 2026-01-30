import { execSync } from "child_process";

const { CONTAINER_NAME, VOLUME_NAME } = process.env;

function runCommand(cmd: string) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch (err) {
    return "";
  }
}

const existing = runCommand(`docker ps -aq -f name=${CONTAINER_NAME}`);

if (existing) {
  console.log(`⚡ Останавливаем контейнер ${CONTAINER_NAME}...`);
  runCommand(`docker stop ${CONTAINER_NAME}`);

  console.log(`🗑 Удаляем контейнер ${CONTAINER_NAME}...`);
  runCommand(`docker rm ${CONTAINER_NAME}`);
} else {
  console.log(`❌ Контейнер ${CONTAINER_NAME} не найден`);
}

const volumeExists = runCommand(`docker volume ls -q -f name=${VOLUME_NAME}`);

if (volumeExists) {
  console.log(`🗑 Удаляем volume ${VOLUME_NAME}...`);
  runCommand(`docker volume rm ${VOLUME_NAME}`);
} else {
  console.log(`❌ Volume ${VOLUME_NAME} не найден`);
}

console.log("✅ Удаление контейнера и volume завершено");