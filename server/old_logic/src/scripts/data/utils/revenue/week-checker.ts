import * as fs from 'fs';
import * as path from 'path';
import appRootPath from 'app-root-path';

// TODO: REFACTORING - FIND IT USER AND REFACTOR THE WHOLE PART
/**
 * Скрипт для поиска недель без сообщений
 * 
 * Алгоритм:
 * 1. Читает нормализованный JSON с сообщениями
 * 2. Собирает Set всех недель, в которые есть хотя бы одно сообщение (пн-вс)
 * 3. Генерирует список всех недель в диапазоне от первого до последнего сообщения
 * 4. Находит недели без сообщений
 * 5. Выводит статистику и список пропущенных недель в формате "пн - вс"
 * 
 * Пример вывода:
 * 
 * 📅 Период анализа:
 *    От: 2023-04-01
 *    До: 2025-03-01
 * 
 * 📈 Статистика:
 *    Всего недель в периоде: 100
 *    Недель с сообщениями: 95
 *    Недель БЕЗ сообщений: 5
 * 
 * ⚠️  Недели БЕЗ сообщений (пн-вс):
 * 
 *    2023-12-25 - 2023-12-31
 *    2024-05-06 - 2024-05-12
 */

// Types
interface Message {
    id: string;
    from: string;
    text: string;
    time: string;
    date: string;
    source_file: string;
    numbers: number[];
}

// Paths
const inputPath = path.resolve(appRootPath.path, 'data/revenue/revenue_normalized.json');

// Вспомогательные функции
const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Корректируем для воскресенья
    return new Date(d.setDate(diff));
};

const getSunday = (date: Date): Date => {
    const monday = getMonday(date);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return sunday;
};

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0] ?? '';
};

const getWeekKey = (date: Date): string => {
    const monday = getMonday(date);
    return formatDate(monday);
};

// Main function
const findMissingWeeks = () => {
    console.log('🔍 Поиск недель без сообщений...\n');

    // Читаем файл
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Файл не найден: ${inputPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(inputPath, 'utf-8');
    const messages: Message[] = JSON.parse(rawData);

    if (messages.length === 0) {
        console.log('❌ Нет сообщений для анализа');
        return;
    }

    console.log(`📊 Всего сообщений: ${messages.length}\n`);

    // Собираем Set недель с сообщениями (пн-вс)
    const weeksWithMessages = new Set<string>();
    
    messages.forEach(msg => {
        const date = new Date(msg.date);
        const weekKey = getWeekKey(date);
        weeksWithMessages.add(weekKey);
    });

    // Находим диапазон дат
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];

    if (!firstMessage?.date || !lastMessage?.date) {
        console.log('❌ Не удалось определить диапазон дат');
        return;
    }

    const firstDate = new Date(firstMessage.date);
    const lastDate = new Date(lastMessage.date);

    console.log(`📅 Период анализа:`);
    console.log(`   От: ${formatDate(firstDate)}`);
    console.log(`   До: ${formatDate(lastDate)}\n`);

    // Генерируем все недели в диапазоне
    const allWeeks: string[] = [];
    const currentWeekStart = getMonday(firstDate);
    const endWeekStart = getMonday(lastDate);

    while (currentWeekStart <= endWeekStart) {
        allWeeks.push(formatDate(currentWeekStart));
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    // Находим недели без сообщений
    const missingWeeks = allWeeks.filter(week => !weeksWithMessages.has(week));

    console.log(`📈 Статистика:`);
    console.log(`   Всего недель в периоде: ${allWeeks.length}`);
    console.log(`   Недель с сообщениями: ${weeksWithMessages.size}`);
    console.log(`   Недель БЕЗ сообщений: ${missingWeeks.length}\n`);

    if (missingWeeks.length > 0) {
        console.log('⚠️  Недели БЕЗ сообщений (пн-вс):\n');
        missingWeeks.forEach(weekStart => {
            const monday = new Date(weekStart);
            const sunday = getSunday(monday);
            console.log(`   ${formatDate(monday)} - ${formatDate(sunday)}`);
        });
    } else {
        console.log('✅ Все недели содержат хотя бы одно сообщение!');
    }
};

// Run
findMissingWeeks();