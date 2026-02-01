import { env } from "../../lib/env";
import { runCommand } from "../../lib/run-command";

async function removePostgresContainer (logger = console.log) {
  const { 
      DB_VOLUME,
      DB_CONTAINER,
    } = env

    const existing = runCommand(`docker ps -aq -f name=${DB_CONTAINER}`);

    if (existing) {
      logger(`⚡ Stopping container ${DB_CONTAINER}...`);
      runCommand(`docker stop ${DB_CONTAINER}`);

      logger(`🗑 Deleting ${DB_CONTAINER}...`);
      runCommand(`docker rm ${DB_CONTAINER}`);
    } else {
      logger(`❌ Container ${DB_CONTAINER} was not found`);
    }

    const volumeExists = runCommand(`docker volume ls -q -f name=${DB_VOLUME}`);

    if (volumeExists) {
      logger(`🗑 Deleting volume ${DB_VOLUME}...`);
      runCommand(`docker volume rm ${DB_VOLUME}`);
    } else {
      logger(`❌ Volume ${DB_VOLUME} was not found`);
    }

    logger("✅ Container and volume deletion complete");
}

removePostgresContainer()
