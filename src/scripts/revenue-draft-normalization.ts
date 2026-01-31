import * as fs from 'fs';
import * as path from 'path';
import appRootPath from 'app-root-path';

// Types
interface OldMessage {
    id: string;
    from: string;
    text: string;
    time: string;
    full_date: string;
    source_file: string;
    numbers: number[];
}

interface NewMessage {
    id: string;
    from: string;
    text: string;
    time: string;
    date: string;
    source_file: string;
    numbers: number[];
}

// Paths
const inputPath = path.resolve(appRootPath.path, 'data/revenue/revenue_draft.json');
const outputPath = path.resolve(appRootPath.path, 'data/revenue/revenue_normalized.json');

// Вспомогательная функция для парсинга даты из формата Telegram
const parseTelegramDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
        // Формат: "14.11.2021 11:27:31 UTC+03:00"
        const match = dateString.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+UTC([+-]\d{2}):(\d{2})/);
        
        if (!match) {
            console.warn(`Не удалось распарсить дату: ${dateString}`);
            return dateString;
        }
        
        const [_, day, month, year, hour, minute, second, tzHour, tzMinute] = match;
        
        // Создаём строку в формате ISO с правильным часовым поясом
        const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}${tzHour}:${tzMinute}`;
        
        // Парсим и возвращаем в ISO формате (автоматически конвертируется в UTC)
        const date = new Date(isoString);
        return date.toISOString();
    } catch (error) {
        console.warn(`Ошибка при парсинге даты: ${dateString}`, error);
        return dateString;
    }
};

// Main function
const normalizeDates = () => {
    console.log('📅 Начинаем нормализацию дат...\n');

    // Читаем исходный файл
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Файл не найден: ${inputPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(inputPath, 'utf-8');
    const oldMessages: OldMessage[] = JSON.parse(rawData);

    console.log(`Найдено сообщений: ${oldMessages.length}\n`);

    // Преобразуем сообщения
    const newMessages: NewMessage[] = oldMessages.map((msg, index) => {
        const normalizedDate = parseTelegramDate(msg.full_date);
        
        if ((index + 1) % 100 === 0) {
            console.log(`✓ Обработано ${index + 1} из ${oldMessages.length}`);
        }

        return {
            id: msg.id,
            from: msg.from,
            text: msg.text,
            time: msg.time,
            date: normalizedDate,
            source_file: msg.source_file,
            numbers: msg.numbers
        };
    });

    console.log('\n📊 Сортируем по датам (от старых к новым)...\n');

    // Сортируем по датам (от самых старых к самым новым)
    newMessages.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
    });

    // Сохраняем результат
    fs.writeFileSync(outputPath, JSON.stringify(newMessages, null, 2), 'utf-8');

    console.log(`✅ Готово! Сохранено в: ${outputPath}`);
    console.log(`📊 Обработано сообщений: ${newMessages.length}`);
    
    const firstMessage = newMessages[0];
    const lastMessage = newMessages[newMessages.length - 1];

    if (firstMessage && lastMessage) {
        console.log(`📅 Самое старое сообщение: ${firstMessage.date}`);
        console.log(`📅 Самое новое сообщение: ${lastMessage.date}`);
    }
};

// Run
normalizeDates();