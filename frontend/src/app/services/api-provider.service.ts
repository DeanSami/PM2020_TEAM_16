import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LoadingService } from '../loading.service';

export class UnhandledException { }

export enum ReqType {
  head,
  get,
  post,
  put,
  patch,
  delete
}

@Injectable()
export class ApiProviderService {
  token: string;
  userToken: string;

  constructor(private http: HttpClient) {  }

  get(path, params?: object, headers?: HttpHeaders) {
    return this.doRequest(ReqType.get, path, null, params, headers);
  }

  delete(path, params?: object, headers?: HttpHeaders) {
    return this.doRequest(ReqType.delete, path, null, params, headers);
  }

  head(path, params?: object, headers?: HttpHeaders) {
    return this.doRequest(ReqType.head, path, null, params, headers);
  }

  post(path, data?: FormData|object, params?: object, headers?: HttpHeaders) {
    return this.doRequest(ReqType.post, path, data, params, headers);
  }

  put(path, data?: FormData|object, params?: object, headers?: HttpHeaders) {
    return this.doRequest(ReqType.put, path, data, params, headers);
  }

  patch(path, data?: FormData|object, params?: object, headers?: HttpHeaders) {
    return this.doRequest(ReqType.patch, path, data, params, headers);
  }

  doRequest(type: ReqType, path: string, data?: FormData|object, params?: object, headers?: HttpHeaders): Observable<any> {

    headers = headers instanceof HttpHeaders ? headers : new HttpHeaders();
    let httpParams = null;

    if (typeof params === 'object' && params !== null) {
      httpParams = new HttpParams();
      for (const i in params) {
        if (params[i]) {
          httpParams = httpParams.set(i, params[i]);
        }
      }
    }

    const url = environment.apiUrl + path;
    console.log('auth token', this.token);
    if (this.token) {
      headers = headers.append('x-auth', this.token);
    }
    if (this.userToken) {
      headers = headers.append('user-x-auth', this.token);
    }

    switch (type) {
      case ReqType.get:
      case ReqType.delete:
      case ReqType.head:
        if (typeof data === 'object' && data !== null) {
          if (httpParams === null) {
            httpParams = new HttpParams();
          }
          for (const i in data) {
            if (data[i]) {
              httpParams = httpParams.set(i, data[i]);
            }
          }
        }
        if (type === ReqType.head) {
          return this.http.head(url, {params: httpParams, headers});
        }
        if (type === ReqType.delete) {
          return this.http.delete(url, {params: httpParams, headers});
        }
        if (type === ReqType.get) {
          return this.http.get(url, {params: httpParams, headers});
        }
        break;
      case ReqType.put:
      case ReqType.post:
      case ReqType.patch:
        if (!(data instanceof FormData)) {
          headers = headers.append('Content-Type', 'application/json');
        }
        if (type === ReqType.put) {
          return this.http.put(url, data, {params: httpParams, headers});
        }
        if (type === ReqType.patch) {
          return this.http.patch(url, data, {params: httpParams, headers});
        }
        if (type === ReqType.post) {
          return this.http.post(url, data, {params: httpParams, headers});
        }
        break;
      default:
    }

    throw new UnhandledException();
  }
}
