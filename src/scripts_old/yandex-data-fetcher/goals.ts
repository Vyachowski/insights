// src/yandexApi/goals.ts
import { YandexClient } from './client';

export interface Goal {
  id: number;
  name: string;
  type: string;
}

export async function getZayavkaGoalId(
  yandexClient: YandexClient,
  counterId: string
): Promise<number> {
  const data = await yandexClient.get<{ goals: Goal[] }>(
    `/management/v1/counter/${counterId}/goals`
  );

  const goals = data.goals || [];
  if (!goals.length) {
    throw new Error(`No goals found for counter ${counterId}`);
  }

  const goal = goals.find(
    g => g.name.trim().toLowerCase() === 'заявка'
  );

  if (!goal) {
    throw new Error(`Goal "Заявка" not found for counter ${counterId}`);
  }

  return goal.id;
}