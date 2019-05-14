import { scatterSetting, colorThemes_ } from "../../util/setting";
import "./scatter.css"
const debug = true;
//model为0_x轴为人物，model为1_y轴为
const model = 0;
export default class ScatterGraph {
    constructor(opts) {
        debug && console.log(opts);
        this.xdata = opts.xdata;
        this.ydata = opts.ydata;
        this.groupMaps = opts.groupMaps;
        this.groups = opts.groups;
        // element:d3-selection
        this._container = opts.element;
        this.element = opts.element.append('svg')
            .attr('width', scatterSetting.scatterWidth + scatterSetting.left + scatterSetting.right)
            .attr('height', scatterSetting.scatterHeight + scatterSetting.top + scatterSetting.bottom)
            .append('g')
            .attr('transform', 'translate(' + scatterSetting.left + ',' + scatterSetting.top + ')');
        this.eventDatas = 259;
        this.draw();
    }

    draw() {
        // this._ydata = [...this.ydata.keys()];
        // console.log(this._ydata.length);

        // let t = [];
        // let _groups = JSON.parse(JSON.stringify(this.groups));
        // for (const key in this.groups) {
        //     if (_groups.hasOwnProperty(key) && key !== '非108将') {

        //         this.groups[key].forEach(ele=>{
        //             if (ele.name != '宋江' &&
        //                 ele.name != '鲁智深' &&
        //                 ele.name != '林冲' &&
        //                 ele.name != '卢俊义' &&
        //                 ele.name != '李应' &&
        //                 ele.name != '孙立') {
        //                 if (_groups.hasOwnProperty(ele.name)) {

        //                     _groups[ele.name].forEach(ele => {
        //                         t.push(ele.name)
        //                     })
        //                     delete _groups[ele.name];
        //                 }
        //             }
        //             t.push(ele.name)
        //         })
        //     }
        // }

        // this._ydata = t.concat(_groups['非108将']);

        this.createScales();
        this.addAxes();
        this.addBars();
    }

    update(xIndex, yIndex = []) {
        // this.xScale.domain([...this.ydata.keys()].slice(xIndex[0],xIndex[1]));
        this.xScale.domain([...xIndex.keys()]);
        this.yScale.domain(yIndex);
        this.updateAxes(yIndex[1]-yIndex[0]);
        this.updateBars(xIndex,yIndex);
        console.log('update');
    }

    createScales() {
        if (model) {
            this.xScale = d3.scaleLinear().range([0,scatterSetting.scatterWidth])
                .domain([0,258]);
            this.yScale = d3.scaleBand().range([scatterSetting.scatterHeight,0])
                .domain([...this.ydata.keys()])
            // .domain(this._ydata.reverse())
            // .domain([...this.groupMaps.keys()])
        } else {
            // y 轴为s时间
            this.xScale = d3.scaleBand().range([0, scatterSetting.scatterWidth])
                .domain([...this.ydata.keys()]);
            this.yScale = d3.scaleLinear().range([scatterSetting.scatterHeight, 0])
                .domain([0, 258])
        }
    }

    addAxes() {
        const xAxis = d3.axisTop().scale(this.xScale).tickPadding([20])
        const yAxis = d3.axisLeft().scale(this.yScale).ticks(80);
        let that = this;

        this.element.append('g')
            // .attr('transform', 'translate(1,' + scatterSetting.scatterHeight + ')')
            .attr('class', 'x axis')
            .call(xAxis);
        this.element.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(yAxis)
            // .call(customYAis);

        function customYAis(g) {
            g.call(yAxis);
            // g.select('.domain').remove();

            g.selectAll('.tick').append('rect')
                .attr('transform', d=> {
                    if (that.groupMaps.has(d)) {
                        let level = that.groupMaps.get(d);
                        switch (level[1]) {
                            case 1:
                                return 'translate(-100,-5)'
                            case 2:
                                return 'translate(-65,-5)'
                            default:
                                return 'translate(-40,-5)'
                        }
                    } else {
                        return 'translate(-40,-5)'
                    }
                })
                .attr('height','8px')
                .attr('width',d=>{
                    // console.log(d);
                    if (that.groupMaps.has(d)) {
                        let level = that.groupMaps.get(d);
                        switch (level[1]) {
                            case 1:
                                return '100px'
                            case 2:
                                return '65px'
                            default:
                                return '40px'
                        }
                    } else {
                        return '40px'
                    }
                })
                // .style('stroke','#ff0')
                .style('fill', d => {
                    if (that.groupMaps.has(d)) {
                        let level = that.groupMaps.get(d);
                        return colorThemes_[level[0]];
                    } else {
                        return '#eee'
                    }
                });
            g.selectAll('.tick').select('text').raise();
            g.selectAll(".tick line")
                .attr("stroke", "#eee")
                .attr('x2',scatterSetting.scatterWidth)
                .attr("stroke-dasharray", "2,2").raise();
        }

    }

    updateAxes(ticksNum) {
        console.log(ticksNum);
        const xAxis = d3.axisTop().scale(this.xScale).tickPadding([20])
        const yAxis = d3.axisLeft().scale(this.yScale).ticks(80 * ticksNum / 200);

        let that = this;
        function _xAxis(g) {
            g.call(xAxis);
            g.selectAll(".tick line")
                .attr("stroke", "#eee")
                .attr('y2', scatterSetting.scatterHeight)
                .attr("stroke-dasharray", "2,2")
        }

        function _yAxis(g) {
           g.call(yAxis);
           g.selectAll(".tick line")
               .attr("stroke", "#eee")
               .attr('x2', scatterSetting.scatterWidth)
               .attr("stroke-dasharray", "2,2")
        }

        this.element.select('.x')
            .call(_xAxis);
        this.element.select('.y')
            .call(_yAxis)
    }

    updateBars(xIndex,yIndex) {
        // let _people = [...this.ydata.keys()].slice(xIndex[0], xIndex[1])
        let _people = [...xIndex.keys()];
        let _data = this.xdata.filter(e => {
            return _people.indexOf(e.person)!=-1 && e.eventId <= yIndex[1] && e.eventId >= yIndex[0]
        })
        let rects = this.element.selectAll('.bubble')
            .data(_data)
        rects.enter()
                .append('rect')
                .attr('class', 'bubble')
                .style('fill', d => {
                    // console.log(this.groupMaps.get(d.person));//有undefined
                    let t = this.groupMaps.get(d.person);
                    if (t) {
                        return colorThemes_[this.groupMaps.get(d.person)[0]];
                    } else {
                        return '#ccc';
                    }
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
                })
                .merge(rects)

                if (model) {
                    rects.attr('x', d => this.xScale(d.eventId))
                        .attr('y', d => this.yScale(d.person))
                        .attr('width',0.9 * scatterSetting.scatterWidth / _data.length)
                        .attr('height', 0.9 * scatterSetting.scatterHeight / _people.length )
                        .attr('transform', 'translate(-1,0)')
                } else {
                    rects.attr('x', d => this.xScale(d.person))
                        .attr('y', d => this.yScale(d.eventId))
                        .attr('width', 0.9 * scatterSetting.scatterWidth / _people.length)
                        .attr('height', 0.9 * scatterSetting.scatterHeight / _data.length)
                        .attr('transform', 'translate(' + 0.05 * scatterSetting.scatterWidth / _people.length+ ',-' + 0.45 * scatterSetting.scatterHeight / _data.length + ')')

                    console.log('model:--------------',model);
                }
        rects.exit().remove();

        // console.log(
        //     this.xdata
        // );
    }
    addBars() {
        const rects = this.element
            .selectAll('.bubble')
            .data(this.xdata)
            .enter()
            .append('rect')
            .attr('class', 'bubble')

            .style('fill', d => {
                // console.log(this.groupMaps.get(d.person));//有undefined
                let t = this.groupMaps.get(d.person);
                if (t) {
                    return colorThemes_[this.groupMaps.get(d.person)[0]];
                } else {
                    return '#ccc';
                }
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

        if (model) {
            rects.attr('x', d => this.xScale(d.eventId))
                .attr('y', d => this.yScale(d.person))
                .attr('width', scatterSetting.scatterWidth / this.eventDatas )
                .attr('height', scatterSetting.scatterHeight / this.ydata.size - 1)
                .attr('transform', 'translate(-1,0)')
        } else {
            rects.attr('x', d => this.xScale(d.person))
                .attr('y', d => this.yScale(d.eventId))
                .attr('width', scatterSetting.scatterWidth / this.ydata.size - 1)
                .attr('height', scatterSetting.scatterHeight / this.eventDatas - 1)
                .attr('transform', 'translate(1,2)')
        }
    }
}