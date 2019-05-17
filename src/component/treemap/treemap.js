import {
    treemapSetting,
    colorThemes_
} from "../../util/setting";
import "./tree.css"

export default class TreeMap {
    constructor(props) {
        this.data = props.data;
        this.element = props.element.append('svg')
            .attr('width', treemapSetting.treemapWidth)
            .attr('height', treemapSetting.treemapHeight)
            .append('g')
            .attr('transform', 'translate(' + treemapSetting.left + ',' + treemapSetting.top + ')');

        console.log(this.data);
        this.draw();
    }

    drawbeta() {
        // stratify the data: reformatting for d3.js
        var root = d3
            .stratify()
            .id(d => d['name'])
            .parentId(d => d['group'])(this.data);
        root.sum(function (d) {
            return 1
        }) // Compute the numeric value for each entity

        // Then d3.treemap computes the position of each element of the hierarchy
        // The coordinates are added to the root object above
        d3.treemap()
            .size([treemapSetting.treemapWidth, treemapSetting.treemapHeight])
            .padding(4)
            (root)
        console.log(root);
        console.log(root.leaves())
        // use this information to add rectangles:
        this.element
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) {
                return d.x0;
            })
            .attr('y', function (d) {
                return d.y0;
            })
            .attr('width', function (d) {
                return d.x1 - d.x0;
            })
            .attr('height', function (d) {
                return d.y1 - d.y0;
            })
            .style("stroke", "black")
            .style("fill", d => {
                //   if (colorThemes_[d.data.group]==undefined) {
                //       console.log(d);
                //   }
                let key = d.data.group;
                if (key == '关胜' ||
                    key == '呼延灼' ||
                    key == '张清' ||
                    key == '戴宗' ||
                    key == '李逵' ||
                    key == '穆弘' ||
                    key == '李俊' ||
                    key == '欧鹏' ||
                    key == '燕顺') {
                    key = '宋江';
                }
                if (d.data.group == '史进') {
                    key = '鲁智深'
                }
                return colorThemes_[key]
            });

        // and to add the text labels
        this.element
            .selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) {
                return d.x0 + 10
            }) // +10 to adjust position (more right)
            .attr("y", function (d) {
                return d.y0 + 20
            }) // +20 to adjust position (lower)
            .text(function (d) {
                return d.data.name
            })
            .attr("font-size", "15px")
            .attr("fill", "white")
    }

    draw() {
        const treemap = d3.treemap()
            .size([treemapSetting.treemapWidth, treemapSetting.treemapHeight])
            .paddingOuter(16);
        const root = d3.hierarchy(this.data)
            .sum((d) => d.size);

        const tree = treemap(root);

        const node = this.element.selectAll('g')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('transform',d => 'translate(' + [d.x0,d.y0] + ')')

        node.append('rect')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('class','node')
            .attr('fill', d => {
                switch (d.depth) {
                    case 1:
                        return colorThemes_[d.data.name];
                    case 2:
                        return colorThemes_[d.parent.data.name];
                    case 3:
                        console.log(d);
                        return colorThemes_[d.parent.parent.data.name]
                    default:
                        return '#ccc'
                }
            })

        node.append('text')
            .attr('dx', d => {
                if (d.x1 - d.x0 < d.y1 - d.y0) {
                    return 8;
                } else {
                    return 4;
                }
            })
            .attr('dy', d => {
                if (d.x1 - d.x0 < d.y1 - d.y0) {
                    return 0;
                } else {
                    return 12;
                }
            })
            .attr('class', d => {
                if (d.x1-d.x0 < d.y1-d.y0) {
                    return 'vertical-text'
                }
            })
            .text(d=>{
                if (d.data.name) {
                    return d.data.name
                } else {
                    console.log(d);
                    return '.'
                }
            })
    }
}