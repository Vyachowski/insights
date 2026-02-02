import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import appRootPath from 'app-root-path';

// TODO: REFACTORING - FIND IT USER AND REFACTOR THE WHOLE PART
/** Загружает все HTML-файлы из указанной папки */
export const loadHtmlFiles = async (dir: string): Promise<string[]> => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  return files.map(f => fs.readFileSync(path.join(dir, f), 'utf-8'));
};

/** Извлекает сообщения с числами ≥1000 из массива HTML */
export const extractMessages = (htmls: string[]): { date: Date; from: string; text: string }[] => {
  const messages: { date: Date; from: string; text: string }[] = [];

  htmls.forEach(html => {
    const $ = cheerio.load(html);
    let lastFrom = '';

    $('div.message.default.clearfix, div.message.default.clearfix.joined').each((_, el) => {
      const el$ = $(el);

      // Игнорируем service сообщения
      if (el$.hasClass('service')) return;

      // Определяем от кого сообщение
      const fromEl = el$.find('.from_name');
      const from = fromEl.length ? fromEl.text().trim() : lastFrom;

      if (!from) return; // если нет from, пропускаем

      if (fromEl.length) lastFrom = from; // запоминаем для joined

      // Дата
      const dateStr = el$.find('.pull_right.date.details').attr('title')?.trim();
      if (!dateStr) return;
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;

      // Текст
      const textEl = el$.find('.text').clone(); // clone чтобы не мутировать оригинал
      textEl.find('.reactions').remove();       // удаляем реакции
      const text = textEl.text().replace(/\s+/g, ' ').trim();
      if (!text) return;

      messages.push({ date, from, text });
    });
  });

  return messages;
};

const htmlDir = path.resolve(appRootPath.path, '../../Downloads/Telegram Lite/ChatExport_2026-01-30/html/');
const html = await loadHtmlFiles(htmlDir);
const messages = extractMessages(html);

fs.writeFileSync(path.resolve(appRootPath.path, 'parsed_revenue_messages.json'), JSON.stringify(messages, null, 2), 'utf-8');

console.log(`Найдено сообщений с суммами: ${messages.length}`);
