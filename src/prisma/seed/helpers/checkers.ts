import { prisma } from "../../../lib/prisma";

export async function checkDatabaseConnection() {
  console.log('Проверяем подключение к базе данных...');
  
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Подключение к базе данных успешно установлено');
    console.log(`📍 База: ${process.env.DB_URL?.split('@')[1]?.split('?')[0] || 'unknown'}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:');
    console.error(error);
    console.error('\nПроверьте:');
    console.error('1. Docker контейнер запущен: docker ps');
    console.error('2. Переменная DB_URL в .env файле');
    console.error('3. Правильность учетных данных');

    return false;
  }
}