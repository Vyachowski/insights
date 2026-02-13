import fs from "fs/promises";
import config from "../config/config";
import { createResultMessage } from "./utils/create-result-mesage";

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
export async function createRevenueCSV() {
  const inputFilePath = config.paths.input.revenue;
  const outputFilePath = config.paths.output.revenue;

  const rawData = await fs.readFile(inputFilePath, "utf-8");

  const messages: Message[] = JSON.parse(rawData);

  const csvData = messages.map((msg) => {
    const amount = msg.numbers.reduce((sum, num) => sum + num, 0);

    const date = new Date(msg.date).toISOString().split("T")[0];

    return {
      cityId: "",
      date: date,
      amount: amount.toFixed(2),
    };
  });

  const header = "cityId,date,amount";
  const rows = csvData.map((row) => `${row.cityId},${row.date},${row.amount}`);

  const csvContent = [header, ...rows].join("\n");

  await fs.writeFile(outputFilePath, csvContent, "utf-8");

  return {
    data: rows,
    message: createResultMessage("Revenue", rows.length, outputFilePath),
  };
}
