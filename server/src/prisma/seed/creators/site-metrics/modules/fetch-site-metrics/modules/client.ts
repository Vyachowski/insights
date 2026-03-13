import axios from 'axios';
import type { AxiosInstance } from 'axios';
import 'dotenv/config';

export class YandexClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api-metrika.yandex.net',
      headers: {
        Authorization: `OAuth ${process.env.YANDEX_API_OAUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const res = await this.client.get<T>(url, { params });
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          'Yandex API GET Error:',
          url,
          params,
          err.response?.data ?? err.message,
        );
      } else if (err instanceof Error) {
        console.error('Yandex API GET Error:', url, params, err.message);
      } else {
        console.error('Yandex API GET Error:', url, params, String(err));
      }

      throw err;
    }
  }
}
