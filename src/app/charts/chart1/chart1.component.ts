import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrl: './chart1.component.scss',
})
export class Chart1Component implements OnInit {
  data = [125, 100, 50, 75, 200, 60, 160];
  width = 80;

  constructor(private element: ElementRef) {
    console.log(element.nativeElement);
  }

  //width = width svg / number of rect
  //with = svg.width / data.length

  ngOnInit() {
    //auto caculating the with of bars to fit charts
    const svg = this.element.nativeElement.getElementsByTagName('svg')[0];
    const dimensions = svg.getBoundingClientRect();
    this.width = dimensions.width / this.data.length;
  }
}
