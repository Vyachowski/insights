import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { env } from '../../../../lib/env';

export class YandexClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api-metrika.yandex.net',
      headers: {
        Authorization: `OAuth ${env.YANDEX_API_OAUTH_TOKEN}`,
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
