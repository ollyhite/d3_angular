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
  textLabel: any;
  @Input() data;
  rectWidth = 30;
  padding = 3;
  dimensions: DOMRect;
  left = 60;
  right = 20;
  bottom = 80;
  top = 35;
  innerWidth;
  innerHeight;
  xAxis: any;
  yAxis: any;
  // from d3 document
  x = d3.scaleBand().paddingInner(0.2).paddingOuter(0.2);
  y = d3.scaleLinear();

  sortedBySalary = false;

  get barsData() {
    return this.sortedBySalary
      ? this.data.sort((a, b) => +b.employee_salary - +a.employee_salary)
      : this.data.sort((a, b) => (a.employee_name < b.employee_name ? -1 : 1));
  }

  constructor(private element: ElementRef) {
    this.host = d3.select(element.nativeElement);

    console.log(this);
  }

  ngOnInit() {
    //this will select the first svg in the page (chart1) not the right one
    // this.svg = d3.select('svg');
    this.svg = this.host.select('svg').on('click', () => {
      this.dataChanged();
    });
    this.setDimensions();
    this.setElements();
  }

  dataChanged() {
    this.sortedBySalary = !this.sortedBySalary;
    this.updateChart();
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

    this.textLabel = this.svg
      .append('g')
      .attr('class', 'yAxisLabel')
      // .attr('y', this.top + 0.5 * this.innerHeight)
      // .attr('x', 10)
      .attr('transform', `translate(${0.5 * this.dimensions.width} 20)`)
      .append('text')
      .attr('class', 'label')
      // .attr('transform', `rotate(-90)`)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.svg) return;
    this.updateChart();
  }

  updateChart() {
    this.setParams();
    this.setAxis();
    this.setLabels();
    this.draw();
  }

  setAxis() {
    const updateXAxis = (xAxisContainer) => {
      xAxisContainer.call(this.xAxis);

      xAxisContainer
        .selectAll('.tick text')
        .attr('transform', 'translate(-10,2)rotate(-45)')
        .style('text-anchor', 'end')
        .text(this.getEmployeeName);
    };

    this.xAxis = d3.axisBottom(this.x).tickSizeOuter(0);
    this.xAxisContainer.transition().duration(500).call(updateXAxis);
    // this.xAxisContainer.call(this.xAxis);
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
      // .tickPadding(10)
      .tickFormat(d3.format('$~s'));
    this.yAxisContainer.call(this.yAxis);

    this.yAxisContainer.selectAll('.tick line').style('stroke', '#ddd');
  }

  setLabels() {
    this.textLabel.text('Employee Salary');
  }

  getEmployeeName = (id) => this.data.find((d) => d.id === id).employee_name;

  setParams() {
    const ids = this.barsData.map((d) => d.id);
    this.x.domain(ids).range([0, this.innerWidth]);
    const max_salary =
      1.3 * Math.max(...this.data.map((item) => item.employee_salary));
    this.y.domain([0, max_salary]).range([this.innerHeight, 0]);
  }
  draw() {
    const bars = this.dataContainer
      .selectAll('rect')
      .data(this.barsData || [], (d) => d.id);
    // .data(this.barsData || []);

    // bars
    //   .attr('x', (d) => this.x(d.id))
    //   .attr('width', this.x.bandwidth())
    //   .attr('y', (d) => this.y(d.employee_salary))
    //   .attr('height', (d) => this.innerHeight - this.y(d.employee_salary));

    bars
      .enter()
      .append('rect')
      .merge(bars)
      .transition()
      .duration(500)
      .attr('x', (d) => this.x(d.id))
      .attr('width', this.x.bandwidth())
      .attr('y', (d) => this.y(d.employee_salary))
      .attr('height', (d) => this.innerHeight - this.y(d.employee_salary));

    bars.exit().remove();
  }
}
