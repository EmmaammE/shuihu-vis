import dataStore from "./util/data";
import ScatterGraph from './component/scatterGraph/index'
import "./main.css";

const debug = true;
dataStore('event.csv', 'relation.csv')
    .then(data => {
        debug && console.log(data);
        const scatterGraph = new ScatterGraph({
            element:d3.select('#scatter'),
            xdata:data.scatterData,
            ydata:data.peopleSet,
            groupMaps:data.groupMaps
        })
    })
    .catch(err => console.log(err))