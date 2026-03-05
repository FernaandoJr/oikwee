export interface IHttpClient<T> {
  get(options: IHttpOptions): Promise<T[]>;
  getOne(id: string, options?: IHttpOptions): Promise<T>;
  create(values: T, options?: IHttpOptions): Promise<ISuccessResponse>;
  update(
    id: string,
    values: T,
    options?: IHttpOptions,
  ): Promise<ISuccessResponse>;
  patch(
    id: string,
    values: T,
    options?: IHttpOptions,
  ): Promise<ISuccessResponse>;
  delete(id: string, options: IHttpOptions): Promise<ISuccessResponse>;
}

export interface ISuccessResponse {
  guid?: string;
  status: number;
  message: string;
}

export interface IErrorResponse {
  status: number;
  message: string;
}

export interface IHttpOptions {
  version: string;
  baseURL: string;
}
