import {
  Component,
  ElementRef,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-chart2',
  templateUrl: './chart2.component.html',
  styleUrl: './chart2.component.scss',
})
export class Chart2Component implements OnInit, OnChanges {
  // data = [125, 100, 50, 75, 200, 60, 300];
  @Input() data;

  rectWidth = 80;
  max = 150;
  dimensions: DOMRect;
  outerPadding = 0;
  padding = 0;
  bandwidth = 0;
  bandwidthCoef = 0.8; //80%=0.8
  left = 10;
  right = 20;
  bottom = 16;
  top = 15;
  innerWidth;
  innerHeight;
  // margin = {
  //   left: 10,
  //   right: 20,
  //   bottom: 30,
  //   top: 15,
  // };

  constructor(private element: ElementRef) {
    // console.log(element.nativeElement);
  }

  //width = width svg / number of rect
  //with = svg.width / data.length

  ngOnInit() {
    //auto caculating the with of bars to fit charts
    const svg = this.element.nativeElement.getElementsByTagName('svg')[0];
    this.dimensions = svg.getBoundingClientRect();
    this.innerWidth = this.dimensions.width - this.left - this.right;
    this.innerHeight = this.dimensions.height - this.top - this.bottom;
    this.setParams();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes', changes);
    this.setParams();
  }

  setParams() {
    const data = this.data || [];
    // console.log('data', data);
    this.rectWidth = (this.innerWidth - 2 * this.outerPadding) / data.length;
    this.bandwidth = this.bandwidthCoef * this.rectWidth;
    this.padding = (1 - this.bandwidthCoef) * this.rectWidth;
    this.max = 1.3 * Math.max(...data.map((item) => item.employee_age)); //1.3 = 130% so wont really hit the max
  }
}
