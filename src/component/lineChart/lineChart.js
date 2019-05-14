import { lineGraphSetting } from "../../util/setting";
import "./lineChart.css"

export default class LineChart {
    constructor(opts) {
        this.data = opts.data;
        this.element = opts.element.append('svg')
                    .attr('width', lineGraphSetting.lineGraphWidth + lineGraphSetting.left + lineGraphSetting.right)
                    .attr('height', lineGraphSetting.lineGraphHeight + lineGraphSetting.top + lineGraphSetting.bottom)
                    .append('g')
                    .attr('transform','translate(' + lineGraphSetting.left + ',' + lineGraphSetting.top + ')');

        // console.log(this.data);
        this.draw();
    }

    draw() {
        this.createScales();
        this.addAxes();
        this.createLines();
    }

    createScales() {
        this.xScale = d3.scaleLinear().range([0,lineGraphSetting.lineGraphWidth]).domain([0,this.data.length]);
        this.yScale = d3.scaleLinear().range([lineGraphSetting.lineGraphHeight,0])
            .domain([0,d3.max(this.data,d => d.personArr.length)]).nice();
            // .domain([0, 30]).nice();
        console.log(this.xScale.domain());
    }

    addAxes() {
        const xAxis = d3.axisBottom().scale(this.xScale).tickPadding([10]).ticks(120);
        const yAxis = d3.axisLeft().scale(this.yScale);

        this.element.append('g')
            .attr('transform', 'translate(0,' + lineGraphSetting.lineGraphHeight + ')')
            .attr('class', 'x axis')
            .call(xAxis);
        this.element.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(yAxis)
    }

    createLines() {
        var that = this;
        // define the line
        var valueline = d3.line()
            .x(function (d) {
                return that.xScale(d['编号']);
            })
            .y(function (d) {
                return that.yScale(d.personArr.length);
            });

        this.element.append("path")
            .data([this.data])
            .attr("class", "line")
            .attr("d", valueline);

        const legends = this.element.append('g')
            .selectAll('g')
            .data(this.data)
            .enter()
            .append('g')
        let _random = function (seed) {
            return ('0.' + Math.sin(seed).toString().substr(6));
        }
        let _point1 = (d) => 'translate(' + this.xScale(d['编号']) + ',' + this.yScale(d.personArr.length) + ')';
        let _x1 = (d) => this.xScale(d['编号'])
        let _y1 = (d) => this.yScale(d.personArr.length);
        let _x2 = (d) => this.xScale(d['编号']);
        // let _y2 = (d) => (this.yScale(d.personArr.length*8) - 50);
        let _y2 = (d) => (lineGraphSetting.lineGraphHeight - this.yScale(d.personArr.length) + 50 * _random(d['编号']))

        legends.append('line')
            // .filter(d, d['abbr']=='')
            .attr("stroke-dasharray", "2,2")
            .attr('x1',d => _x1(d))
            .attr('y1',d => _y1(d))
            .attr('x2',d => _x2(d))
            .attr('y2',d => _y2(d))
            .attr('class','legend-line')

        legends.append('circle')
            .attr('r', '2px')
            .attr('class', 'pointer')
            .attr('transform', d => _point1(d))

        legends.append('circle')
            .attr('r', d => d['abbr'].length * 3 + 'px')
            .attr('class','legend')
            .attr('transform', d => 'translate(' + _x2(d) +',' + _y2(d) + ')')

        legends.append('text')
            .text(d => d['abbr'])
            .attr('x',d => _x2(d))
            .attr('y', d => `${_y2(d) - 15}px`)
            .attr('class','e')
    }
}