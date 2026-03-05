import { AxiosInstance } from 'axios';
import { IHttpClient, IHttpOptions, ISuccessResponse } from './types';

export class HttpClient<T, TCreate = T, TUpdate = Partial<T>>
  implements IHttpClient<T, TCreate, TUpdate>
{
  http: AxiosInstance;
  version: string;
  baseURL: string;

  constructor(http: AxiosInstance, version: string, baseURL: string) {
    this.http = http;
    this.version = version;
    this.baseURL = baseURL;
  }

  async get(options?: IHttpOptions): Promise<T[]> {
    const response = await this.http.get<T[]>(options?.baseURL ?? this.baseURL);
    return response.data ?? [];
  }

  async getOne(id: string, options?: IHttpOptions): Promise<T> {
    const response = await this.http.get<T>(
      `${options?.baseURL ?? this.baseURL}/${id}`,
    );
    return response.data;
  }

  async create(
    values: TCreate,
    options?: IHttpOptions,
  ): Promise<ISuccessResponse> {
    const response = await this.http.post<ISuccessResponse>(
      options?.baseURL ?? this.baseURL,
      values,
    );
    return response.data;
  }

  async update(
    id: string,
    values: T,
    options?: IHttpOptions,
  ): Promise<ISuccessResponse> {
    const response = await this.http.put<ISuccessResponse>(
      `${options?.baseURL ?? this.baseURL}/${id}`,
      values,
    );
    return response.data;
  }

  async patch(
    id: string,
    values: TUpdate,
    options?: IHttpOptions,
  ): Promise<ISuccessResponse> {
    const response = await this.http.patch<ISuccessResponse>(
      `${options?.baseURL ?? this.baseURL}/${id}`,
      values,
    );
    return response.data;
  }

  async delete(id: string, options?: IHttpOptions): Promise<ISuccessResponse> {
    const response = await this.http.delete<ISuccessResponse>(
      `${options?.baseURL ?? this.baseURL}/${id}`,
    );
    return response.data;
  }
}
