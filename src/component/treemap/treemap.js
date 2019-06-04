import {
    treemapSetting,
    colorThemes_,
    song
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

        // console.log(this.data);
        this.draw();
        this.addUpdateListener();
        this.addRemoveListener();
        this.groupMaps = props.groupMaps;
    }

    addUpdateListener() {
        let that = this;
        d3.select('#treemap').select('svg').on('customBrush', function (d) {
            var { people,peopleEvent } = d3.event.detail;
            console.log('people:',people,'peopleEvent:',peopleEvent);
            // that.showLinks();
            that.element.selectAll('g').data([]).exit().remove();
                // .attr('class', d => {
                //     if (people.indexOf(d.data.name)===-1 && d.depth == 2) {
                //         return 'hidden'
                //     }
                // })
            let selectedData = {};

            // console.log(that.groupMaps);
            // let _p = [];
            // let _k = [...that.groupMaps.keys()];
            // [...that.groupMaps.values()].forEach((e,index)=>{
            //     if(e[1]==3) {
            //         _p.push({
            //             [_k[index]]: e
            //         });
            //     }
            // })
            // console.log(_p);
            people.forEach( ele => {
                let parent = (that.groupMaps.get(ele) ? that.groupMaps.get(ele) : '非108将');
                if (selectedData.hasOwnProperty(parent)) {
                    selectedData[parent].push(ele);
                } else {
                    selectedData[parent] = [ele];
                }
            })

            console.log(peopleEvent,':peopleEvent');
            // 1代表为父亲节点；2是直接child；3是再子
            let _data = {
                name:'派系',
                children:[]
            };
            for (const key in selectedData) {
                if (selectedData.hasOwnProperty(key)) {
                    // key已经转换为了string
                    let keyArr = key.split(',');
                    //===
                    switch (+keyArr[1]) {
                        case 3 :
                            switch (+keyArr[2]) {
                                case 4.1:
                                    //属于鲁智深-》史进派系（data.js)
                                    let indexOutter = -1,indexInner = -1;
                                    for (let i = 0; i < _data.children.length; i++) {
                                        if (_data.children[i].name == '鲁智深') {
                                            indexOutter = i;break;
                                        }
                                    }
                                    if (indexOutter == -1) {
                                        _data.children.push({
                                            name: '鲁智深',
                                            children: [{
                                                name: '史进',
                                                children: selectedData[key].map(e=>({name:e,size:1}))
                                            }]
                                        })
                                    } else {
                                        for (let i = 0; i < _data.children[indexOutter].children.length; i++) {
                                            if ( _data.children[indexOutter].children[i].name == '史进' ) {
                                                indexInner = i; break;
                                            }
                                        }
                                        _data.children[indexOutter].children[indexInner] = {
                                            name:"史进",
                                            children:selectedData[key].map(e=>({name:e,size:peopleEvent[e].length}))
                                        }
                                    }
                                    break;

                                default:
                                    let _group = song[keyArr[2] - 4.1]
                                    let indexOutter_ = -1,
                                        indexInner_ = -1;
                                    for (let i = 0; i < _data.children.length; i++) {
                                        if (_data.children[i].name == '宋江') {
                                            indexOutter_ = i;
                                            break;
                                        }
                                    }
                                    if (indexOutter_ == -1) {
                                        _data.children.push({
                                            name: '宋江',
                                            children: [{
                                                name: _group,
                                                children: selectedData[key].map(e => ({
                                                    name: e,
                                                    size: peopleEvent[e].length
                                                }))
                                            }]
                                        })
                                    } else {
                                        for (let i = 0; i < _data.children[indexOutter_].children.length; i++) {
                                            if (_data.children[indexOutter_].children[i].name == _group) {
                                                indexInner_ = i;
                                                break;
                                            }
                                        }
                                        _data.children[indexOutter_].children[indexInner_] = {
                                            name: _group,
                                            children: selectedData[key].map(e => ({
                                                name: e,
                                                size: peopleEvent[e].length
                                            }))
                                        }
                                    }

                                    break;
                            }

                            break;
                        case 2:
                            let index = -1;
                            for (let i = 0; i < _data.children.length; i++) {
                               if (_data.children[i].name == keyArr[0]) {
                                   index = i;
                                   break;
                               }
                            }
                            if (index == -1) {
                                //添加已经有的子派系
                                _data.children.push({
                                    name: keyArr[0],
                                    children: []
                                });
                                index = _data.children.length - 1 ;
                            }
                            console.log(_data,index);
                            selectedData[key].forEach( e => {
                                _data.children[index].children.push({
                                    name:e,
                                    size:peopleEvent[e].length
                                })
                            })
                            break;
                        case 1:
                            selectedData[key].forEach( e => {
                                let index = -1;
                                for (let i = 0; i < _data.children.length; i++) {
                                    if (_data.children[i].name == e) {
                                        index = i;
                                        break;
                                    }
                                }
                                if (index == -1) {
                                    _data.children.push({
                                        name: e,
                                        children: [{
                                            name: e,
                                            size: peopleEvent[e].length
                                        }]
                                    })
                                    index = _data.children.length - 1;
                                } else {
                                    _data.children[index].children.push({
                                        name: e,
                                        size: peopleEvent[e].length
                                    })
                                }
                            })
                            break;
                        default:
                            //undefined:非108将
                            _data.children.push({
                                name:'非108将',
                                children: selectedData[key].map(e => ({
                                    name: e,
                                    size: peopleEvent[e].length
                                }))
                            })
                            break;
                    }
                }
            }

            // console.log(selectedData,'_data:',_data);
           that.drawGraph(_data,d => {
            if (d.data.name) {
                return d.data.name + " " + (peopleEvent[d.data.name] && d.depth!==1?peopleEvent[d.data.name].length:'')
            } else {
                return null;
            }
        });
        })
    }

    addRemoveListener() {
        d3.select('#treemap').select('svg').on('removeBrush', () => {
            this.element.selectAll('g').data([]).exit().remove();
            this.draw();
        });
    }
    showLinks() {

    }

    drawGraph(data,createText) {
         const treemap = d3.treemap()
             .size([treemapSetting.treemapWidth, treemapSetting.treemapHeight])
             .paddingOuter(16);
         const root = d3.hierarchy(data)
             .sum((d) => d.size);

         const tree = treemap(root);

         // console.log(root.descendants());
         const node = this.element.selectAll('g')
             .data(root.descendants())
             .enter()
             .append('g')
             .attr('transform', d => 'translate(' + [d.x0, d.y0] + ')')

         node.append('rect')
             .attr('width', d => d.x1 - d.x0)
             .attr('height', d => d.y1 - d.y0)
             .attr('class', d => {
                 if (d.depth === 2) {
                    return 'node parent'
                 } else {
                     return 'node';
                 }
             })
             .attr('fill', d => {
                switch (d.depth) {
                    case 1:
                        return colorThemes_[d.data.name];
                    case 2:
                        return colorThemes_[d.parent.data.name];
                    case 3:
                        return colorThemes_[d.parent.parent.data.name]
                    default:
                        return '#ccc'
                }
             });

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
                 if (d.x1 - d.x0 < d.y1 - d.y0) {
                     return 'vertical-text'
                 }
             })
             .text(createText)
    }
    draw() {
        this.drawGraph(this.data, d => {
            if (d.data.name) {
                return d.data.name
            } else {
                return null;
            }
        });
    }
}