// 处理数据
export default (eventsPath, relationPath) => {
    return new Promise(resolve => {
        d3.csv(eventsPath, function (err, response) {
            err && console.log(err);

            response.sort((a, b) => a['年份'] - b['年份']);

            d3.csv(relationPath, function (err, res) {
                err && console.log(err);

                /**108 将中每个人的党派关系 */
                let groups = {
                    无党派: []
                };

                res.forEach((ele, index) => {
                    let _group = ele.group;
                    if (_group === '无党派') {
                        groups['无党派'].push(ele);
                    } else if (groups.hasOwnProperty(_group)) {
                        groups[_group].push(ele);
                    } else {
                        groups[_group] = [ele];
                    }

                });

                // 每个人对应的大党派关系
                let groupMaps = new Map();
                Object.keys(groups).forEach(key => {
                    groups[key].forEach(item => {
                        // console.log(item);
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
                            groupMaps.set(item.name, '宋江');
                        } else if (key == '史进') {
                            groupMaps.set(item.name, '鲁智深');
                        } else {
                            groupMaps.set(item.name, key);
                        }
                    });
                });

                // console.log(groupMaps);

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
                console.log(peopleSet);
                resolve({
                    peopleSet,
                    scatterData
                })
            });
        });
    })
};