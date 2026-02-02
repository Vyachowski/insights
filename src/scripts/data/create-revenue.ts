import appRootPath from 'app-root-path';
import * as fs from 'fs';
import path from 'path';

interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  date: string;
  source_file: string;
  numbers: number[];
}

// NOTE: Simplified version - transforms JSON to CSV
function createRevenueCSV () {
    // Читаем JSON файл
    const inputFile = process.argv[2] || path.resolve(appRootPath.path, 'data/revenue/drafts/revenue.json');
    const outputFile = process.argv[3] || path.resolve(appRootPath.path, 'data/revenue/revenue.csv');
    const rawData = fs.readFileSync(inputFile, 'utf-8');
  

  const messages: Message[] = JSON.parse(rawData);

  // Преобразуем в формат для CSV
  const csvData = messages.map(msg => {
    // Суммируем все числа из массива numbers
    const amount = msg.numbers.reduce((sum, num) => sum + num, 0);
    
    // Преобразуем дату в формат YYYY-MM-DD
    const date = new Date(msg.date).toISOString().split('T')[0];

    return {
      city_id: '',
      date: date,
      amount: amount.toFixed(2)
    };
  });

  // Формируем CSV строки
  const header = 'city_id,date,amount';
  const rows = csvData.map(row => 
    `${row.city_id},${row.date},${row.amount}`
  );

  // Объединяем заголовок и строки
  const csvContent = [header, ...rows].join('\n');

  // Записываем в файл
  fs.writeFileSync(outputFile, csvContent, 'utf-8');
  
  console.log(`✓ Конвертировано ${csvData.length} записей`);
  console.log(`✓ CSV сохранён в ${outputFile}`);
}

createRevenueCSV()
