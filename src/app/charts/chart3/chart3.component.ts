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
  dataContainer: any;
  xAxisContainer: any;
  yAxisContainer: any;
  @Input() data;
  rectWidth = 30;
  padding = 3;
  dimensions: DOMRect;
  left = 60;
  right = 20;
  bottom = 16;
  top = 15;
  innerWidth;
  innerHeight;
  xAxis: any;
  yAxis: any;
  // from d3 document
  x = d3.scaleBand().paddingInner(0.2).paddingOuter(0.2);
  y = d3.scaleLinear();

  constructor(private element: ElementRef) {
    this.host = d3.select(element.nativeElement);

    console.log(this);
  }

  ngOnInit() {
    //this will select the first svg in the page (chart1) not the right one
    // this.svg = d3.select('svg');
    this.svg = this.host.select('svg');
    this.setDimensions();
    this.setElements();
  }

  setDimensions() {
    this.dimensions = this.svg.node().getBoundingClientRect();
    this.innerWidth = this.dimensions.width - this.left - this.right;
    this.innerHeight = this.dimensions.height - this.top - this.bottom;
  }

  setElements() {
    this.xAxisContainer = this.svg
      .append('g')
      .attr('class', 'xAxisContainer')
      .attr(
        'transform',
        `translate(${this.left},${this.top + this.innerHeight})`
      );
    this.yAxisContainer = this.svg
      .append('g')
      .attr('class', 'yAxisContainer')
      .attr('transform', `translate(${this.left},${this.top})`);
    this.dataContainer = this.svg
      .append('g')
      .attr('class', 'dataContainer')
      .attr('transform', `translate(${this.left},${this.top})`);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.svg) return;
    this.setParams();
    this.setAxis();
    this.draw();
  }

  setAxis() {
    this.xAxis = d3.axisBottom(this.x).tickSizeOuter(0);
    this.xAxisContainer.call(this.xAxis);
    //.ticks(10) id default
    // this.yAxis = d3.axisLeft(this.y).ticks(10);
    // const max = this.y.domain()[1];
    // const values = [0, 0.25, 0.5, 0.75, 1].map((d) => d * max);
    // this.yAxis = d3.axisLeft(this.y).tickValues(values);
    // this.yAxis = d3.axisLeft(this.y).tickSize(-this.innerWidth);
    this.yAxis = d3
      .axisLeft(this.y)
      .tickSizeOuter(0)
      .tickSizeInner(-this.innerWidth)
      .tickPadding(10)
      .tickFormat(d3.format('$~s'));
    this.yAxisContainer.call(this.yAxis);
  }

  setParams() {
    const ids = this.data.map((d) => d.id);
    this.x.domain(ids).range([0, this.innerWidth]);
    const max_salary =
      1.3 * Math.max(...this.data.map((item) => item.employee_salary));
    this.y.domain([0, max_salary]).range([this.innerHeight, 0]);
  }
  draw() {
    this.dataContainer
      .selectAll('rect')
      .data(this.data || [])
      .enter()
      .append('rect')
      .attr('x', (d) => this.x(d.id))
      .attr('width', this.x.bandwidth())
      .attr('y', (d) => this.y(d.employee_salary))
      .attr('height', (d) => this.innerHeight - this.y(d.employee_salary));
  }
}
