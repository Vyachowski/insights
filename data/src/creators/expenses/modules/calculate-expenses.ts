import { calcHostingAmount, calcTelephonyAmount } from "../utils/utils";

const expenseType = {
  hosting: "hosting",
  telephony: "telephony",
};

export function calculateExpenses(cityIds: number[], months: Date[]) {
  const lines: string[] = [];
  lines.push("date,type,cityId,amount");

  for (const month of months) {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const hostingTotal = calcHostingAmount(month);
    const telephonyTotal = calcTelephonyAmount(month);

    // Базовая сумма в день, округлённая до копейки
    const hostingPerDay = Math.floor((hostingTotal / daysInMonth) * 100) / 100;
    const telephonyPerDay = Math.floor((telephonyTotal / daysInMonth) * 100) / 100;

    let hostingAccum = 0;
    let telephonyAccumPerCity = cityIds.map(() => 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      // --- Хостинг ---
      let hostingAmount = hostingPerDay;
      hostingAccum += hostingAmount;

      if (day === daysInMonth) {
        // Коррекция на разницу в последний день
        const diff = Math.round((hostingTotal - hostingAccum) * 100) / 100;
        hostingAmount += diff;
      }

      lines.push(`${date},${expenseType.hosting},,${hostingAmount.toFixed(2)}`);

      // --- Телефония ---
      const telephonyAmounts = cityIds.map(() => telephonyPerDay);
      cityIds.forEach((_, i) => {
        telephonyAccumPerCity[i] += telephonyAmounts[i];
      });

      if (day === daysInMonth) {
        // Коррекция на разницу для каждого города
        const accumulatedSum = telephonyAccumPerCity.reduce((a, b) => a + b, 0);
        const diff = Math.round((telephonyTotal - accumulatedSum) * 100) / 100;

        // Разбиваем разницу на города (по одному центу на каждый, пока не исчерпаем)
        let remainingDiff = Math.round(diff * 100); // в копейках
        for (let i = 0; remainingDiff !== 0 && i < cityIds.length; i++) {
          const delta = remainingDiff > 0 ? 0.01 : -0.01;
          telephonyAmounts[i] += delta;
          remainingDiff += remainingDiff > 0 ? -1 : 1;
        }
      }

      cityIds.forEach((cityId, i) => {
        lines.push(`${date},${expenseType.telephony},${cityId},${telephonyAmounts[i].toFixed(2)}`);
      });
    }
  }

  return lines;
}
