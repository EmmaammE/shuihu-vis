import { scatterSetting, colorThemes_ } from "../../util/setting";

const debug = true;
export default class ScatterGraph {
    constructor(opts) {
        debug && console.log(opts);
        this.xdata = opts.xdata;
        this.ydata = opts.ydata;
        this.groupMaps = opts.groupMaps;
        // element:d3-selection
        this.element = opts.element.append('svg')
            .attr('width', scatterSetting.scatterWidth + scatterSetting.left + scatterSetting.right)
            .attr('height', scatterSetting.scatterHeight + scatterSetting.top + scatterSetting.bottom)
            .append('g')
            .attr('transform', 'translate(' + scatterSetting.left + ',' + scatterSetting.top + ')');
        this.draw();
    }

    draw() {
        this.createScales();
        this.addAxes();
        this.addBars();
    }

    createScales() {
        this.xScale = d3.scaleLinear().range([0,scatterSetting.scatterWidth]).domain([0,258]);
        this.yScale = d3.scaleBand().range([scatterSetting.scatterHeight,0])
            // .domain([...this.ydata.keys()].reverse());
            .domain([...this.groupMaps.keys()])
    }

    addAxes() {
        const xAxis = d3.axisBottom().scale(this.xScale).tickPadding([20]);
        const yAxis = d3.axisLeft().scale(this.yScale);

        this.element.append('g')
            .attr('transform', 'translate(1,' + scatterSetting.scatterHeight + ')')
            .attr('class', 'x axis')
            .call(xAxis);
        this.element.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(customYAis);

        function customYAis(g) {
            g.call(yAxis);
            // g.select('.domain').remove();
            // g.selectAll(".tick line")
            //     .attr("stroke", "#777")
            //     .attr("stroke-dasharray", "2,2")
            g.selectAll('.tick').append('rect')
                .attr('transform','translate(-40,-5)')
                .attr('height','10px')
                .attr('width',d=>{
                    console.log(d);
                    return '40px';
                })
                .style('stroke','#ff0')
        }

    }

    addBars() {
        const rects = this.element
            .selectAll('.bubble')
            .data(this.xdata)
            .enter()
            .append('rect')
            .attr('class', 'bubble')
            .attr('y', d => this.yScale(d.person))
            .attr('x', d => this.xScale(d.eventId))
            .attr('width', scatterSetting.scatterWidth / this.ydata.size - 1)
            .attr('height', scatterSetting.scatterHeight / 259)
            .attr('transform', 'translate(2,-2)')
            // .attr('data-event', d => d.eventId)
            .style('fill', d => {
                // color(d.eventId)
                return colorThemes_[this.groupMaps.get(d.person)] ?
                    colorThemes_[this.groupMaps.get(d.person)] :
                    '#ccc'
            })
            .on('mouseover', d => {
                console.log(d);
                    rects.style('opacity', e => {
                        if (e.person == d.person || e.eventId == d.eventId) {
                            return 1;
                        } else {
                            return 0.5;
                        }
                    });
                })
                .on('mouseout', d => {
                    rects.style('opacity', 1);
                });
    }
}