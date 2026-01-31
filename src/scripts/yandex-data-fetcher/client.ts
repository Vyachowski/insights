// src/yandexApi/client.ts
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { YANDEX_TOKEN } from './config';

export class YandexClient {
  private client: AxiosInstance;

  constructor() {
    if (!YANDEX_TOKEN) throw new Error('YANDEX_API_OAUTH_TOKEN not set');

    this.client = axios.create({
      baseURL: 'https://api-metrika.yandex.net',
      headers: {
        Authorization: `OAuth ${YANDEX_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const res = await this.client.get<T>(url, { params });
      return res.data;
    } catch (err: any) {
      console.error(
        'Yandex API GET Error:',
        url,
        params,
        err.response?.data || err.message
      );
      throw err;
    }
  }
}
