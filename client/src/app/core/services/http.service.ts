import {
  HttpClient,
  HttpHeaders,
  HttpContext,
  HttpParams,
} from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

/**
 * Interface which represents the values that can be stored in the options
 * of a request.
 *
 * NOTE: The format of the data is taken from the Angular HttpClient source.
 */
interface HttpClientOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

/**
 * Provides a wrapper around the HTTP requests against the SignLab backend.
 *
 * This makes changing out the base URL, custom error handling, testing, and
 * working with promises easier.
 */
@Injectable()
export class SignLabHttpClient {
  /** The base url all SignLab backend requests are made against */
  private baseUrl: string;

  constructor(private http: HttpClient) {
    const baseUrl = location.origin;
    // Ensure the url does not have a trailing '/'
    if (baseUrl.endsWith('/')) {
      this.baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    } else {
      this.baseUrl = baseUrl;
    }
  }

  async post<T>(
    urlStub: string,
    body: any | null,
    options?: HttpClientOptions
  ): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(this.fromStub(urlStub), body, options)
    );
  }

  async get<T>(urlStub: string, options?: HttpClientOptions): Promise<T> {
    return firstValueFrom(this.http.get<T>(this.fromStub(urlStub), options));
  }

  async put<T>(
    urlStub: string,
    body: any | null,
    options?: HttpClientOptions
  ): Promise<T> {
    return firstValueFrom(
      this.http.put<T>(this.fromStub(urlStub), body, options)
    );
  }

  async delete<T>(urlStub: string, options?: HttpClientOptions): Promise<T> {
    return firstValueFrom(this.http.delete<T>(this.fromStub(urlStub), options));
  }

  /**
   * Produce a complete URL from the base URL + the stub.
   *
   * Checks to see if there is a leading '/' and adds it if needed.
   */
  private fromStub(stub: string): string {
    // Remove any leading '/'
    if (stub.startsWith('/')) {
      stub = stub.substring(1);
    }
    return `${this.baseUrl}/${stub}`;
  }
}
