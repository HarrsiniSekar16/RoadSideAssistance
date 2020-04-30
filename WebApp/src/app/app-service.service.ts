import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import { HttpInterceptor} from '@angular/common/http';

import {Observable} from 'rxjs';
import { IResponse } from './interface/IResponse';
@Injectable()
export class AppServiceService {


  constructor(private http: HttpClient) {
  }

  geturl(path: string, param: any[]) {

    let url_map = environment.services.filter(x => x.code == path);

    let url = environment.api_url + url_map[0].url;

    if(param) {
    param.forEach(x => {
      url = url + "/" + x;
    });
  }
    return url;
  }

  get<T>(url: string, param?: any[]) : Observable<any> {

    let urlparam = this.geturl(url, param);

    return this.http.get<T>(urlparam);
  }
  
  put<T>(url: string, body: any, param?:any[]) : Observable<any> {

    let urlparam = this.geturl(url, param);

    return this.http.put<T>(urlparam,body);
  }

  post<T>(url: string, body: any, param?:any[]) : Observable<any>{
    
    let urlparam = this.geturl(url, param);
    // generic type of response
    return this.http.post<T>(urlparam,body);
  }

  getExternal<T>(url): Observable<any>{
    return this.http.get(url);
  }
}

@Injectable()
export class APIInterceptorService implements HttpInterceptor {
   intercept(req: HttpRequest<any>, next: HttpHandler):   Observable<HttpEvent<any>> {
       // All HTTP requests are going to go through this method
       let newHeaders = req.headers;
       let t: IResponse = JSON.parse(sessionStorage.getItem('jwt_token'));
       if (t != null && req.url.includes("localhost")) {
             req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + t.token ) });
       }
      return next.handle(req);
  }
}