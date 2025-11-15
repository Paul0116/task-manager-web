import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { config } from '../config/config';

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public timestamp?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RetryConfig {
  retries: number;
  retryDelay: number;
}

class HttpClient {
  private axiosInstance: AxiosInstance;
  private retryConfig: RetryConfig;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': config.userId,
      },
    });

    this.retryConfig = {
      retries: config.retryAttempts,
      retryDelay: config.retryDelay,
    };

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: number };

        if (
          error.response &&
          (error.response.status === 429 || error.response.status >= 500) &&
          (!originalRequest._retry || originalRequest._retry < this.retryConfig.retries)
        ) {
          originalRequest._retry = (originalRequest._retry || 0) + 1;

          const delay = this.retryConfig.retryDelay * Math.pow(2, originalRequest._retry - 1);
          
          await this.sleep(delay);
          
          return this.axiosInstance(originalRequest);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const data = error.response.data as any;
      return new ApiError(
        data?.message || error.message || 'An error occurred',
        error.response.status,
        data?.timestamp
      );
    } else if (error.request) {
      return new ApiError('No response from server. Please check your connection.', 0);
    } else {
      return new ApiError(error.message || 'An unexpected error occurred', 0);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  setUserId(userId: string): void {
    this.axiosInstance.defaults.headers.common['X-User-Id'] = userId;
  }
}

export const httpClient = new HttpClient();
