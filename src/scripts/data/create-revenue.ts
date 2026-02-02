import * as fs from 'fs';
import config from '../../config';

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
    const inputFilePath = config.dataFilePaths.rawData.revenue
    const outputFilePath = config.dataFilePaths.import.revenue

    const rawData = fs.readFileSync(inputFilePath, 'utf-8');
  
  const messages: Message[] = JSON.parse(rawData);

  const csvData = messages.map(msg => {
    const amount = msg.numbers.reduce((sum, num) => sum + num, 0);
  
    const date = new Date(msg.date).toISOString().split('T')[0];

    return {
      city_id: '',
      date: date,
      amount: amount.toFixed(2)
    };
  });

  const header = 'city_id,date,amount';
  const rows = csvData.map(row => 
    `${row.city_id},${row.date},${row.amount}`
  );

  const csvContent = [header, ...rows].join('\n');

  fs.writeFileSync(outputFilePath, csvContent, 'utf-8');
  
  console.log(`✓ Конвертировано ${csvData.length} записей`);
  console.log(`✓ CSV сохранён в ${outputFilePath}`);
}

createRevenueCSV()
