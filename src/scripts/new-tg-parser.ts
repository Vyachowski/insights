import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import appRootPath from 'app-root-path';

// Types
interface Message {
  id: string;
  from: string;
  text: string;
  date: string;
  numbers: number[];
}

//Data
const inputFolderPath = path.resolve(appRootPath.path, 'data/revenue/telegram-archive');
const outputPath = path.resolve(appRootPath.path, 'data/revenue/revenue_draft.json');
const minNumber = 100;
const maxNumber = 1_000_000;

// Helpers
const getFilePaths = (inputFolderPath: string) => {
    console.log(`Поиск HTML файлов в: ${inputFolderPath}\n`);
    
    if (!fs.existsSync(inputFolderPath)) {
        console.error(`❌ Папка не найдена: ${inputFolderPath}`);
        process.exit(1);
    }

    const filePaths = fs.readdirSync(inputFolderPath)
                        .filter(file => file.endsWith('.html'))
                        .map(file => path.join(inputFolderPath, file));

    if (filePaths.length === 0) {
        console.error('❌ HTML файлы не найдены в указанной папке');
        process.exit(1);
    }

    console.log(`Найдено HTML файлов: ${filePaths.length}\n`);

    return filePaths;
}

const readFiles = (filePaths: string[]): string[] => {
    return filePaths.map(filePath => {
        try {
            const result = fs.readFileSync(filePath, 'utf-8')
            console.log(`✓ Обработан файл: ${path.basename(filePath)}`)
            return result
        } catch (error) {
            console.error(`✗ Ошибка при обработке файла ${path.basename(filePath)}:`, error)
            process.exit(1)
        }
    })
}

const readFile = (filePath: string): string => fs.readFileSync(filePath, 'utf-8')

// Вспомогательная функция для извлечения чисел из текста
const extractNumbers = (text: string): number[] => {
    // Находим все числа в тексте (включая номера телефонов, но фильтруем их)
    const numberMatches = text.match(/\d+/g);
    
    if (!numberMatches) return [];

    return numberMatches
        .map(num => parseInt(num, 10))
        .filter(num => num >= minNumber && num <= maxNumber);
};

const extractMessages = (html: string): Message[] => {
    const $ = cheerio.load(html);
    const messages: Message[] = [];

    // Находим все div'ы с классом 'message' и id начинающимся с 'message'
    $('div.message[id^="message"]').each((_, element) => {
        const $message = $(element);
        
        // Пропускаем служебные сообщения (с классом 'service')
        if ($message.hasClass('service')) {
            return;
        }

        // Извлекаем ID сообщения
        const fullId = $message.attr('id') || '';
        const id = fullId.replace('message-', '').replace('message', '');

        // Извлекаем имя отправителя
        const from = $message.find('.from_name').text().trim();

        // Извлекаем текст сообщения
        const text = $message.find('.text').text().trim();

        // Извлекаем дату
        const dateTitle = $message.find('.date.details').attr('title') || '';
        const date = parseTelegramDate(dateTitle);

        // Извлекаем все числа из текста
        const numbers = extractNumbers(text);

        messages.push({
            id,
            from,
            text,
            date,
            numbers
        });
    });

    return messages;
};

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

// const filterMessagesWithNumbers => (): Message[] => {

// }

// App