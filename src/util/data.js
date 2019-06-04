// 处理数据
export default (eventsPath, relationPath) => {
    return new Promise(resolve => {
        d3.csv(eventsPath, function (err, response) {
            err && console.log(err);

            response.sort((a, b) => a['年份'] - b['年份']);

            d3.csv(relationPath, function (err, res) {
                err && console.log(err);

                /** 在event.csv中出现的所有人*/
                var peopleSet = new Set();
                /**
                 *      记录每一年最早出现的事件Id
                 */
                var eventYearMap = new Map();
                /** 对每个事件的人物展开 ;同一事件用同样的颜色
                             * scatterData = [{
                                'person':'高俅',
                                'chapter':'2',
                                'eventId':'编号'//可以对应到response[eventId-1]
                            }]
                */
                var scatterData = [];

                response.forEach((ele, index) => {
                    ele['编号'] = index + 1; //编号修改成按照事件发生顺序
                    let arr = ele['人物'].split('、');
                    if (!eventYearMap.has(+ele['年份'])) {
                        eventYearMap.set(+ele['年份'], +ele['编号']);
                    }
                    // 为event.csv中每一项增加一个属性，保存人物数组
                    ele.personArr = arr;

                    arr.forEach(k => {
                        peopleSet.add(k);

                        scatterData.push({
                            person: k,
                            chapter: ele['章回'],
                            eventId: ele['编号']
                        });
                    });

                    // data.scenes.push({
                    //     people: arr,
                    //     chapter: ele['章回'],
                    //     loc: ele['地点（可确定）'],
                    //     event: ele['事件'],
                    //     index: index + 1,
                    // });
                });

                /**108 将中每个人的党派关系 */
                let groups = {
                    无党派: [],
                    非108将: [],
                };

                let hierarchyData2 = res.slice();
                // console.log(res);
                let hierarchyData = {
                    name:'派系',
                    children:[{
                        name:'宋江',
                        children:[]
                    },{
                        name:'鲁智深',
                        children:[]
                    }]
                };
                res.forEach((ele,index) => {
                    let _group = ele.group;
                    if (_group === '无党派') {
                        groups['无党派'].push(ele);
                    } else if (groups.hasOwnProperty(_group)) {
                        groups[_group].push(ele);
                    } else {
                        groups[_group] = [ele];
                    }

                    if(ele['relation'] == '自己') {
                        hierarchyData2[index]['group'] = 'root';
                    }
                });

                    hierarchyData2.push({
                        id: 109,
                        star: '',
                        nickname: '',
                        name: 'root',
                        group: '',
                        relation: ''
                    }, {
                        id: 110,
                        star: '',
                        nickname: '',
                        name: '无党派',
                        group: 'root',
                        relation: ''
                    });

                groups['非108将'] = [...peopleSet.values()].concat(res.map(ele => ele.name)).filter(function (v, i, arr) {
                    return arr.indexOf(v) === arr.lastIndexOf(v);
                });
                //将王定六算到穆弘里面
                groups['穆弘'].push(groups['张顺'][0]);
                delete groups['张顺'];
                // console.log(groups);

                for (const key in groups) {
                    if (groups.hasOwnProperty(key)) {
                        const element = groups[key];
                        if (key == '史进') {
                            hierarchyData.children[1].children.push({
                                name: key,
                                children: element.map(e => ({
                                    name: e.name,
                                    size: 1
                                }))
                            })
                        } else if (key == '关胜' ||
                            key == '呼延灼' ||
                            key == '张清' ||
                            key == '戴宗' ||
                            key == '李逵' ||
                            key == '穆弘' ||
                            key == '李俊' ||
                            key == '欧鹏' ||
                            key == '燕顺') {
                            hierarchyData.children[0].children.push({
                                name:key,
                                children: element.map(e => ({
                                    name: e.name,
                                    size: 1
                                }))
                            })
                        } else if ( key == '宋江') {
                            hierarchyData.children[0].children = hierarchyData.children[0].children.concat(element.map(e => ({
                                name: e.name,
                                size: 1
                            })))
                        } else if ( key == '鲁智深') {
                            hierarchyData.children[1].children = hierarchyData.children[1].children.concat(element.map(e => ({
                                name: e.name,
                                size: 1
                            })))
                        } else {
                            hierarchyData.children.push({
                                name: key,
                                children: element.map(e => ({
                                    name: e.name?e.name:e,
                                    size: 1
                                }))
                            })
                        }
                    }
                }

                // hierarchyData.children[6].children[0] = {
                //     name:'',
                //     size:1
                // };
                // console.log('hire', hierarchyData);

                // 每个人对应的大党派关系
                let groupMaps = new Map();
                const song = {
                    '关胜': 1,
                    '呼延灼': 2,
                    '张清': 3,
                    '戴宗': 4,
                    '李逵': 5,
                    '穆弘': 6,
                    '李俊': 7,
                    '欧鹏': 8,
                    '燕顺': 9,
                }
                Object.keys(groups).forEach(key => {
                    groups[key].forEach(item => {
                        // console.log(key);
                        if (
                            key == '关胜' ||
                            key == '呼延灼' ||
                            key == '张清' ||
                            key == '戴宗' ||
                            key == '李逵' ||
                            key == '穆弘' ||
                            key == '李俊' ||
                            key == '欧鹏' ||
                            key == '燕顺'
                        ) {
                            //大党派人物,属于哪一级,对应小派人物,(没有为undefined)
                            groupMaps.set(item.name, ['宋江', 3, song[key] + 4.1]);
                        } else if (key == '史进') {
                            groupMaps.set(item.name, ['鲁智深', 3, 4.1]);
                        } else if (
                            item.name == '关胜' ||
                            item.name == '呼延灼' ||
                            item.name == '张清' ||
                            item.name == '戴宗' ||
                            item.name == '李逵' ||
                            item.name == '穆弘' ||
                            item.name == '李俊' ||
                            item.name == '欧鹏' ||
                            item.name == '燕顺'
                        ) {
                            groupMaps.set(item.name, [key, 2, song[item.name] + 4]);
                        } else if (item.name == '史进') {
                            groupMaps.set(item.name, [key, 2, 4]);
                        } else if (
                            item.name == '宋江' ||
                            item.name == '鲁智深' ||
                            item.name == '林冲' ||
                            item.name == '卢俊义' ||
                            item.name == '李应' ||
                            item.name == '孙立'
                        ) {
                            groupMaps.set(item.name, [key, 1, 0])
                        } else {
                            groupMaps.set(item.name, [key, 2, 0])
                        }
                    });
                });

                // console.log(groupMaps);
                resolve({
                    scatterData: {
                        peopleSet,
                        scatterData,
                        groupMaps,
                        groups
                    },
                    eventsData: response,
                    hierarchyData:hierarchyData
                })
            });
        });
    })
};