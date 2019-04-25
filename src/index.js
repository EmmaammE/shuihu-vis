import dataStore from "./util/data";
import ScatterGraph from './component/scatterGraph/index'
import "./main.css";

const debug = false;
dataStore('event.csv', 'relation.csv')
    .then(data => {
        debug && console.log(data);
        const scatterGraph = new ScatterGraph({
            element:d3.select('#scatter'),
            xdata:data.scatterData,
            ydata:data.peopleSet,
            groupMaps:data.groupMaps,
            groups:data.groups
        })
    })
    .catch(err => console.log(err))