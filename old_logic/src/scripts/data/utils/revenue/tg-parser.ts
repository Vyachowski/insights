import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import appRootPath from 'app-root-path';

// TODO: REFACTORING - FIND IT USER AND REFACTOR THE WHOLE PART
interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  full_date: string;
  source_file: string;
  numbers: number[];
}

/**
 * Извлекает все числа из текста (исключая числа больше 100000)
 */
function extractNumbers(text: string): number[] {
  // Находим все числа в тексте (включая числа с разделителями)
  const numberMatches = text.match(/\d+/g);
  
  if (!numberMatches) {
    return [];
  }
  
  // Преобразуем в числа и фильтруем (оставляем только <= 1_000_000)
  const numbers = numberMatches
    .map(num => parseInt(num, 10))
    .filter(num => !isNaN(num) && num <= 1_000_000);
  
  return numbers;
}

/**
 * Парсит один HTML файл и извлекает сообщения с числами
 */
function parseHtmlFile(filePath: string): Message[] {
  const messages: Message[] = [];
  const fileName = path.basename(filePath);

  try {
    // Чтение HTML файла
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Загрузка HTML в cheerio
    const $ = cheerio.load(html);

    // Перебираем все сообщения (включая с классом 'joined')
    $('.message.default').each((_, element) => {
      const $message = $(element);
      
      // Получаем текст сообщения
      const $textElement = $message.find('.body .text').first();
      const messageText = $textElement.text().trim();
      
      // Пропускаем пустые сообщения
      if (!messageText) {
        return;
      }
      
      // Проверяем, содержит ли сообщение хотя бы одно число
      const containsNumbers = /\d/.test(messageText);
      
      if (containsNumbers) {
        // Извлекаем все числа из текста
        const numbers = extractNumbers(messageText);
        
        // Пропускаем сообщения, где все числа больше 100000
        if (numbers.length === 0) {
          return;
        }
        
        // Получаем имя отправителя
        let fromName = $message.find('.from_name').text().trim();
        
        // Для joined сообщений имя может отсутствовать - ищем в предыдущем
        if (!fromName && $message.hasClass('joined')) {
          const $prevMessage = $message.prevAll('.message.default').not('.joined').first();
          if ($prevMessage.length) {
            fromName = $prevMessage.find('.from_name').text().trim();
          }
        }
        
        if (!fromName) {
          fromName = 'Неизвестный';
        }
        
        // Получаем дату и время
        const $dateElement = $message.find('.body .pull_right.date.details').first();
        const timeText = $dateElement.text().trim();
        const fullDate = $dateElement.attr('title') || '';
        
        // Получаем ID сообщения
        const messageId = $message.attr('id') || '';
        
        // Добавляем в массив
        messages.push({
          id: messageId,
          from: fromName,
          text: messageText,
          time: timeText,
          full_date: fullDate,
          source_file: fileName,
          numbers: numbers
        });
      }
    });

    console.log(`✓ Обработан файл: ${fileName} - найдено ${messages.length} сообщений с числами`);
    
  } catch (error) {
    console.error(`✗ Ошибка при обработке файла ${fileName}:`, error);
  }

  return messages;
}

/**
 * Основная функция
 */
function main() {
  // Путь к папке с HTML файлами
  const dataPath = path.resolve(appRootPath.path, 'data/revenue/telegram-archive');
  const resultPath = path.resolve(appRootPath.path, 'data/revenue');
  
  console.log(`Поиск HTML файлов в: ${dataPath}\n`);

  // Проверяем существование папки
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Папка не найдена: ${dataPath}`);
    process.exit(1);
  }

  // Получаем все HTML файлы
  const files = fs.readdirSync(dataPath)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(dataPath, file));

  if (files.length === 0) {
    console.error('❌ HTML файлы не найдены в указанной папке');
    process.exit(1);
  }

  console.log(`Найдено HTML файлов: ${files.length}\n`);

  // Парсим все файлы
  const allMessages: Message[] = [];
  
  files.forEach(filePath => {
    const messages = parseHtmlFile(filePath);
    allMessages.push(...messages);
  });

  // Сортируем сообщения по дате
  allMessages.sort((a, b) => {
    if (a.full_date && b.full_date) {
      return a.full_date.localeCompare(b.full_date);
    }
    return 0;
  });

  // Сохраняем результат в JSON
  const outputPath = path.join(resultPath, 'messages-with-numbers.json');
  fs.writeFileSync(outputPath, JSON.stringify(allMessages, null, 2), 'utf-8');

  console.log(`\n✅ Готово!`);
  console.log(`Всего найдено сообщений с числами: ${allMessages.length}`);
  console.log(`Результат сохранен в: ${outputPath}`);
}

// Запуск
main();