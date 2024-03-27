import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  getEmployees(): Observable<any> {
    return this.http
      .get<any>('https://dummy.restapiexample.com/api/v1/employees')
      .pipe(map((answer) => answer.data));
  }
}
