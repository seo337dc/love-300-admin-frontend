import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";
import queryString from "query-string";
import { getAuthorization, setAuthorization } from "../store/authorization";

declare module "axios" {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

export class ApiException {
  public readonly code: string;
  public readonly entity: object | null;
  public readonly status: number;
  public readonly message: any | null;
  public readonly errors: ApiFieldError[];

  constructor(response: AxiosResponse<any, any> | undefined) {
    if (response?.data) {
      this.code = response.data.code;
      this.entity = response.data.entity;
      this.status = response.data.status;
      this.message = response.data.message;
      this.errors = response.data.errors;
    }
  }
}

export class ApiFieldError {
  public readonly field: string | null;
  public readonly value: string | null;
  public readonly reason: string | null;
}

export abstract class ApiClient {
  protected readonly instance: AxiosInstance;

  protected constructor(baseURL: string) {
    const env = process.env.NODE_ENV ?? "";

    let origin;

    if (env === "production") {
      origin = "https://admin-api.one-q.net";
    } else if (env === "development") {
      origin = "https://dev-admin-api.one-q.net";
    } else {
      origin = "http://localhost:8099";
    }
    // origin = "https://admin-api.one-q.net";

    // origin = "http://localhost:8099";
    this.instance = axios.create({
      baseURL: origin + baseURL,
    });
    this.instance.defaults.headers.common = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    };

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleError
    );

    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  private _handleResponse = ({ data, headers }: AxiosResponse) => {
    if (!!headers.authorization) {
      const token = headers.authorization.replace(/^Bearer( )*/, "");
      setAuthorization(token);
    }
    return data;
  };

  protected async _handleError(error: AxiosError) {
    switch (error.response?.status) {
      case 403:
        alert((error.response?.data as any).message);
        window.location.href = "/sign-in";
        throw new ApiException(error.response);
        break;
      case 400:
        throw new ApiException(error.response);
        break;
      case 404:
        alert("서버와 통신이 원활하지 않습니다.");
        break;
      case 500:
        alert("서버와 통신이 원활하지 않습니다.");
        break;
    }
    throw new ApiException(error.response);
  }

  private _handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const token = getAuthorization();
    // console.log(token);
    const { headers } = config;
    if (headers && token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  public get(path: string, params: Object = {}) {
    path = `${path}?${queryString.stringify(params)}`;
    return this.instance.get(path);
  }

  public async post(path: string, payload?: any): Promise<any> {
    return this.instance.request({
      method: "POST",
      url: path,
      data: payload,
      responseType: "json",
    });
  }

  public async put<P = any, R = any>(path: string, payload?: P): Promise<R> {
    return this.instance.request({
      method: "PUT",
      url: path,
      data: payload,
      responseType: "json",
    });
  }

  public async patch(path: string, payload?: any): Promise<any> {
    return this.instance.request({
      method: "PATCH",
      url: path,
      data: payload,
      responseType: "json",
    });
  }

  public async delete(path: string, payload?: any): Promise<any> {
    return this.instance.request({
      method: "DELETE",
      url: path,
      data: payload,
      responseType: "json",
    });
  }
}
