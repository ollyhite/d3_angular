import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart3',
  template: `<svg></svg>`,
  styleUrl: './chart3.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Chart3Component implements OnInit, OnChanges {
  host: any;
  svg: any;
  @Input() data;
  rectWidth = 30;
  padding = 3;
  dimensions: DOMRect;
  // from d3 document
  x = d3.scaleLinear();

  constructor(private element: ElementRef) {
    this.host = d3.select(element.nativeElement);

    console.log(this);
  }

  ngOnInit() {
    //this will select the first svg in the page (chart1) not the right one
    // this.svg = d3.select('svg');
    this.svg = this.host.select('svg');
    this.dimensions = this.svg.node().getBoundingClientRect();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.svg) return;
    this.setParams();
    this.draw();
  }

  setParams() {
    const max_salary =
      1.3 * Math.max(...this.data.map((item) => item.employee_salary));
    this.x.domain([0, max_salary]).range([this.dimensions.height, 0]);
  }
  draw() {
    this.svg
      .selectAll('rect')
      .data(this.data || [])
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (this.rectWidth + this.padding))
      .attr('width', this.rectWidth)
      .attr('height', (d) => this.dimensions.height - this.x(d.employee_salary))
      .attr('y', (d) => this.x(d.employee_salary));
  }
}
