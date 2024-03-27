import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Observable } from 'rxjs';
import dataJson from './services/employees.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'dashboard';
  data1 = [125, 100, 50, 75, 200, 60, 300];
  // data2$: Observable<any[]>;
  data2 = dataJson;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // this.data2$ = this.api.getEmployees();
    this.data2 = dataJson;
    // setTimeout(() => {
    //   this.data1 = [...this.data1, 600];
    // }, 5000);
  }
}
