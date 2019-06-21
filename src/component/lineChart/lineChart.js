import {
	lineGraphSetting
} from '../../util/setting';
import './lineChart.css';

const _width =
	window.innerWidth - lineGraphSetting.left - lineGraphSetting.right;
//event_level:1，先显示； 2，后显示；如果undefined->3
export default class LineChart {
	constructor(opts) {
		this.data = opts.data;
		this.element = opts.element
			.append('svg')
			.attr('width', _width)
			.attr(
				'height',
				lineGraphSetting.lineGraphHeight +
				lineGraphSetting.top +
				lineGraphSetting.bottom
			)
			.append('g')
			.attr(
				'transform',
				'translate(' + lineGraphSetting.left + ',' + lineGraphSetting.top + ')'
			);

		this.currLevel = 1;
		this.draw();

		this.idled = this.idled.bind(this);
	}

	draw() {
		this.createScales();
		this.createLines();
		this.addAxes();

		this.drawBrush();

		// this.addZoomListener();
	}

	addZoomButtons() {
		// [tx + k * x0, ty + k * y0]
		// 倍数因子数组, 初始k->每个元素间隔20px->每个元素间隔40px
		let k = [
			1,
			20 / (this.xScale(2) - this.xScale(1)),
			40 / (this.xScale(2) - this.xScale(1))
		];
		document.getElementById('higher').addEventListener('click', function () {
			this.currLevel = (this.currLevel + 1) % 3;
		});
	}

	addZoomListener() {
		let that = this;

		function zoomed() {
			let t = d3.event.transform;
			let xNewScale = t.rescaleX(that.xScale);
			let toX = d => xNewScale(d['编号']);

			if (t.k <= 1) {
				that.xAxis.ticks(60);
				that.updateLines(that.xScale, d => that.xScale(d['编号']), 1);
				console.log('debug:', that.xScale.domain());
			} else if (2.2 <= t.k && t.k < 5.6) {
				that.xAxis.ticks(120 / t.k);
				that.updateLines(xNewScale, toX, 2);
				console.log('debug:', 2, xNewScale.domain());
			} else if (t.k >= 6) {
				that.xAxis.ticks(120 / t.k);
				that.updateLines(xNewScale, toX, 3);
				console.log('debug:', 3, xNewScale.domain());

			}
		}
		var zoom = d3
			.zoom()
			.scaleExtent([1, 10])
			// .extent([0,0], [_width , lineGraphSetting.lineGraphHeight])
			.on('zoom', zoomed);

		this.element
			.append('rect')
			.attr('class', 'zoom')
			.attr('width', _width)
			.attr('height', lineGraphSetting.lineGraphHeight)
			.call(zoom);
	}

	updateLines(_scale, _scaleToX, level) {
		let self = this;
		d3.select('g.x')
			.transition()
			.call(self.xAxis.scale(_scale));
		d3.selectAll('.line')
			.transition()
			.attr(
				'd',
				d3
				.line()
				.x(_scaleToX)
				.y(function (d) {
					return self.yScale(d.personArr.length);
				})
			);

		let legends = d3
			.select('g.legends')

			.selectAll('g');

		legends
			.select('line')
			.transition()
			.attr('x1', _scaleToX)
			.attr('x2', _scaleToX)
			.attr('stroke-dasharray', '2,2')

			.attr('class', d => {
				switch (level) {
					case 3:
						if (!d.level || d.level <= level) {
							return 'legend-line';
						} else {
							return '';
						}
						default:
							if (d.level && d.level <= level) {
								return 'legend-line';
							} else {
								return '';
							}
				}
			});
		legends
			.select('circle')
			.transition()
			.attr(
				'transform',
				d =>
				'translate(' +
				_scaleToX(d) +
				',' +
				self.yScale(d.personArr.length) +
				')'
			);
		legends
			.select('text')
			.transition()
			.attr('x', _scaleToX)
			.text(d => {
				switch (level) {
					case 3:
						if (d.level <= level || d.level == undefined) {
							return d['abbr'];
						} else {
							return '';
						}
						default:
							if (d.level && d.level <= level) {
								return d['abbr'];
							} else {
								return '';
							}
				}
			})
			.style('font-size', `${9 + level}px`);
	}

	createScales() {
		this.xScale = d3
			.scaleLinear()
			.range([0, _width - lineGraphSetting.right - lineGraphSetting.left])
			.domain([0, this.data.length]);
		this.yScale = d3
			.scaleLinear()
			.range([lineGraphSetting.lineGraphHeight, 0])
			.domain([0, d3.max(this.data, d => d.personArr.length)])
			.nice();
		// .domain([0, 30]).nice();
		console.log(this.xScale.domain());
	}

	addAxes() {
		let xAxis = d3
			.axisBottom()
			.scale(this.xScale)
			.tickPadding([10])
			.ticks(60);
		const yAxis = d3.axisLeft().scale(this.yScale);

		this.element
			.append('g')
			.attr(
				'transform',
				'translate(0,' + lineGraphSetting.lineGraphHeight + ')'
			)
			.attr('class', 'x axis')
			.call(xAxis);
		this.element
			.append('g')
			.attr('transform', 'translate(0,0)')
			.attr('class', 'y axis')
			.call(yAxis);

		this.xAxis = xAxis;
	}

	createLines() {
		var that = this;
		// define the line
		var valueline = d3
			.line()
			.x(function (d) {
				return that.xScale(d['编号']);
			})
			.y(function (d) {
				return that.yScale(d.personArr.length);
			});

		const legends = this.element
			.append('g')
			.attr('class', 'legends')
			.selectAll('g')
			.data(this.data)
			.enter()
			.append('g');

		let clip = legends
			.append('defs')
			.append('svg:clipPath')
			.attr('id', 'clip')
			.append('svg:rect')
			.attr('width', _width - lineGraphSetting.right)
			.attr('height', lineGraphSetting.lineGraphHeight)
			.attr('x', 0)
			.attr('y', 0);

		this.element
			.append('path')
			.data([this.data])
			.attr('class', 'line')
			.attr('d', valueline)
			.attr('clip-path', 'url(#clip)');

		legends.attr('clip-path', 'url(#clip)');

		let _random = function (seed) {
			return (
				'0.' +
				Math.sin(seed)
				.toString()
				.substr(6)
			);
		};
		let _point1 = d =>
			'translate(' +
			this.xScale(d['编号']) +
			',' +
			this.yScale(d.personArr.length) +
			')';
		let _x1 = d => this.xScale(d['编号']);
		let _y1 = d => this.yScale(d.personArr.length);
		let _x2 = d => this.xScale(d['编号']);
		// let _y2 = (d) => (80 * _random(d['编号']) - lineGraphSetting.lineGraphHeight + this.yScale(d.personArr.length) )
		// let _y2 = (d) =>- lineGraphSetting.bottom +  this.yScale(d.personArr.length)
		let _y2 = d => {
			if (d.personArr.length > 100) {
				return lineGraphSetting.bottom;
			}
			return (
				lineGraphSetting.bottom -
				lineGraphSetting.lineGraphHeight / 1.1 +
				this.yScale(d.personArr.length)
			);
		};

		legends
			.append('line')
			.attr('x1', d => _x1(d))
			.attr('y1', d => _y1(d))
			.attr('x2', d => _x2(d))
			.attr('y2', d => _y2(d))
			.filter(d => d.level == 1)
			.attr('stroke-dasharray', '2,2')
			.attr('class', 'legend-line');

		legends
			.append('circle')
			.attr('r', '2px')
			.attr('class', 'pointer')
			.attr('transform', d => _point1(d));

		// legends.append('circle')
		//     .attr('r', d => d.personArr.length)
		//     .attr('class','legend')
		//     .attr('transform', d => 'translate(' + _x2(d) +',' + _y2(d) + ')')

		legends
			.append('text')
			.attr('x', d => _x2(d))
			.attr('y', d => `${_y2(d) - 15}px`)
			.style('font-size', '10px')
			.attr('class', 'e')
			.filter(d => d.level == 1)
			.text(d => d['abbr']);

		// 最后一个g中
		// legends.append('rect')
		//     .attr('class','rect_overlay')
		//     .attr('width',lineGraphSetting.left)
		//     .attr('height',lineGraphSetting.lineGraphHeight)
		//     .attr('transform','translate(-'+lineGraphSetting.left+',0)')

		// legends.append('rect')
		//     .attr('class', 'rect_overlay')
		//     .attr('width', lineGraphSetting.right)
		//     .attr('height', lineGraphSetting.lineGraphHeight)
		//     .attr('transform', 'translate(' + (_width - lineGraphSetting.right - lineGraphSetting.left + 5) + ',0)')
	}

	drawBrush() {
		var brush = d3
			.brushX()
			.extent([
				[0, 0],
				[_width, lineGraphSetting.lineGraphHeight]
			]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
			.on('end', updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

		var $brush = this.element
			.append('g')
			.attr('class', 'brush')
			// .on('customBrush',function (params) {
			// 	console.log('cs');
			// })
			.call(brush);
		let that = this;
		let domain = this.xScale.domain();

		function updateChart() {
			var extent = d3.event.selection;
			console.log('extent', extent);
			let level;
			// console.log('类型检测', Object.prototype.toString.call(that.xScale));
			if (!extent) {
				if (!that.idleTimeout) {
					return (that.idleTimeout = setTimeout(that.idled, 500));
				}
			} else {
				let low = that.xScale.invert(extent[0]);
				let high = that.xScale.invert(extent[1]);
				that.xScale.domain([low,high]);

				let k = _width / (high - low);
				if (k <= 20) {
					level = 1;
				} else if (k <= 30) {
					level = 2;
				} else {
					level = 3;
				}

				// todo：限制可放大的范围
				let peopleSet = new Set();
				let peopleEvent = {};
				for (let index = Math.floor(low); index < Math.round(high); index++) {
					if (that.data[index]) {
						that.data[index].personArr.forEach(e => {
							peopleSet.add(e);
							if (peopleEvent[e]) {
								peopleEvent[e].push(index);
							} else {
								peopleEvent[e] = [index];
							}
						})
					}

				}

				that.xAxis.ticks(high-low);
				// 注册的事件的元素:treemap下的svg
				d3.select('#treemap').select('svg').dispatch('customBrush', {
					detail: {
						people: [...peopleSet.keys()],
						peopleEvent:peopleEvent
					}
				});
				that.element.select('.brush').call(brush.move, null);
			}

			// that.xAxis.call(that.xScale);
			d3.select('g.x')
				.transition()
				.call(that.xAxis.scale(that.xScale));


			that.updateLines(that.xScale, d => that.xScale(d['编号']), level);
		}

		this.element
			.on('dblclick', function () {
				that.xScale.domain(domain);
				// console.log('domain', domain);
				d3.select('g.x')
					.transition()
					.call(that.xAxis.scale(that.xScale));
				// console.log('dbclik', that.xScale.domain());

				// 注册事件：treemap下的svg
				d3.select('#treemap').select('svg').dispatch('removeBrush');
				that.updateLines(that.xScale, d => that.xScale(d['编号']), 1);
			});
	}

	idled() {
		this.idleTimeout = null;
	}
}
