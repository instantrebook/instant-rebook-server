// src/features/hotel/liteapi/liteapi.client.ts

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios';

export class LiteApiError extends Error {
  public readonly statusCode: number;

  public readonly code?: string | number;

  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code?: string | number,
    details?: unknown,
  ) {
    super(message);

    this.name = 'LiteApiError';

    this.statusCode = statusCode;

    this.code = code;

    this.details = details;
  }
}

class LiteApiClient {
  private readonly apiClient: AxiosInstance;

  private readonly bookingClient: AxiosInstance;

  constructor() {
    const apiKey = process.env.LITEAPI_API_KEY;

    if (!apiKey) {
      throw new Error('LITEAPI_API_KEY is not configured');
    }

    const timeout = Number(
      process.env.LITEAPI_TIMEOUT ?? 30000,
    );

    this.apiClient = axios.create({
      baseURL:
        process.env.LITEAPI_API_URL ??
        'https://api.liteapi.travel/v3.0',

      timeout,

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    this.bookingClient = axios.create({
      baseURL:
        process.env.LITEAPI_BOOK_API_URL ??
        'https://book.liteapi.travel/v3.0',

      timeout,

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });
  }

  async apiGet<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response =
        await this.apiClient.get<T>(
          url,
          config,
        );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async apiPost<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.apiClient.post<T>(
        url,
        data,
        config,
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bookingPost<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.bookingClient.post<T>(
        url,
        data,
        config,
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bookingGet<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.bookingClient.get<T>(
        url,
        config,
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bookingPut<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.bookingClient.put<T>(
        url,
        data,
        config,
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): LiteApiError {
    if (!axios.isAxiosError(error)) {
      return new LiteApiError(
        'Unexpected LiteAPI error',
        500,
        undefined,
        error,
      );
    }

    const axiosError = error as AxiosError<any>;

    const statusCode =
      axiosError.response?.status ?? 502;

    const responseData =
      axiosError.response?.data;

    const message =
      responseData?.error?.message ??
      responseData?.error?.description ??
      responseData?.message ??
      axiosError.message ??
      'LiteAPI request failed';

    const code =
      responseData?.error?.code;

    return new LiteApiError(
      message,
      statusCode,
      code,
      responseData,
    );
  }
}

export const liteApiClient =
  new LiteApiClient();