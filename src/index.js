import dataStore from "./util/data";
import scatterGraph from './component/scatterGraph/index'
import "./main.css";

dataStore('event.csv', 'relation.csv')
    .then(data => {
        console.log(data);
        scatterGraph.init();
    })
    .catch(err => console.log(err))