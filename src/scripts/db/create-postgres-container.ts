import { env } from "../../lib/env"
import { runCommand } from "../../lib/run-command"

async function createPostgresContainer (logger = console.log) {
  const { 
      DB_NAME,
      DB_USER,
      DB_PORT,
      DB_PASSWORD,
      DB_CONTAINER,
    } = env

  const existing = runCommand(`docker ps -aq -f name=${DB_CONTAINER}`)

  if (existing) {
    logger(`⚡ Container ${DB_CONTAINER} is already exist, restarting...`)

    runCommand(`docker start ${DB_CONTAINER}`)
  } else {
    logger(`🚀 Creating and running container ${DB_CONTAINER}...`)

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

  const status = runCommand(`docker ps -f name=${DB_CONTAINER}`)

  logger("✅ Container status:")
  logger(status)
}

createPostgresContainer()
