import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClientModule } from '@angular/common/http'; import { HttpModule } from '@angular/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class DataService {

  constructor(private http: Http) { }

  getJSON(): Observable<any> {
    return this.http.get("assets/data.json")
                    .map((res:any) => res.json());

  }

  
}
