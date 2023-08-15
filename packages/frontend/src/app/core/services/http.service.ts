import { HttpClient, HttpHeaders, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TokenService } from './token.service';

/**
 * Interface which represents the values that can be stored in the options
 * of a request.
 */
interface HttpClientOptions {
  /////////////// Begin section taken from Angular's HttpClient ///////////////
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
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  /////////////////////////////////////////////////////////////////////////////

  /////////////// Begin custom section ////////////////////////////////////////
  provideToken?: boolean;
  /////////////////////////////////////////////////////////////////////////////
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

  constructor(private http: HttpClient, private tokenService: TokenService) {
    const baseUrl = location.origin;
    // Ensure the url does not have a trailing '/'
    if (baseUrl.endsWith('/')) {
      this.baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    } else {
      this.baseUrl = baseUrl;
    }
  }

  async post<T>(urlStub: string, body: any | null, options?: HttpClientOptions): Promise<T> {
    return firstValueFrom(this.http.post<T>(this.fromStub(urlStub), body, this.handleBearerToken(options)));
  }

  async get<T>(urlStub: string, options?: HttpClientOptions): Promise<T> {
    return firstValueFrom(this.http.get<T>(this.fromStub(urlStub), this.handleBearerToken(options)));
  }

  async put<T>(urlStub: string, body: any | null, options?: HttpClientOptions): Promise<T> {
    return firstValueFrom(this.http.put<T>(this.fromStub(urlStub), body, this.handleBearerToken(options)));
  }

  async delete<T>(urlStub: string, options?: HttpClientOptions): Promise<T> {
    return firstValueFrom(this.http.delete<T>(this.fromStub(urlStub), this.handleBearerToken(options)));
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

  /**
   * If the bearer token option is added, insert the cooresponding header
   * to the options
   */
  private handleBearerToken(options?: HttpClientOptions): HttpClientOptions | undefined {
    // If options are undefined, do nothing
    if (options === undefined) {
      return undefined;
    }
    // If the provide token option is not provided, do nothing
    if (options.provideToken === undefined) {
      return options;
    }
    // If the provide token option is explicity false, do nothing
    if (options.provideToken === false) {
      return options;
    }

    // Throw an error if the token is not availble
    if (!this.tokenService.hasAuthInfo()) {
      throw new Error('Cannot add token to GET request, token not present');
    }

    // Make a copy of the options
    const newOptions: HttpClientOptions = JSON.parse(JSON.stringify(options));

    // If no existing headers exist, then make new headers with just the
    // token
    if (options.headers === undefined) {
      newOptions.headers = new HttpHeaders({ Authorization: `Bearer ${this.tokenService.token}` });
      return newOptions;
    }

    // Otherwise, add the token to the existing headers. Since headers can
    // be represented in two ways, have to handle adding to either type
    if (options.headers instanceof HttpHeaders) {
      newOptions.headers = options.headers.append('Authorization', `Bearer ${this.tokenService.token}`);
    } else {
      newOptions.headers = new HttpHeaders(options.headers).append(
        'Authorization',
        `Bearer ${this.tokenService.token}`
      );
    }

    return newOptions;
  }
}
