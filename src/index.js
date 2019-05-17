import dataStore from "./util/data";
import ScatterGraph from './component/scatterGraph/index';
import LineChart from "./component/lineChart/lineChart";
import { lineGraphSetting} from "./util/setting";
import "./main.css";
import TreeMap from "./component/treemap/treemap";

const debug = false;
dataStore('event.csv', 'relation.csv')
    .then(data => {
        debug && console.log(data);

        const lineChart = new LineChart({
            element:d3.select('#linechart'),
            data: data.eventsData,
        });

        let scatterGraph = new ScatterGraph({
            element:d3.select('#scatter'),
            xdata:data.scatterData.scatterData,
            ydata:data.scatterData.peopleSet,
            groupMaps:data.scatterData.groupMaps,
            groups:data.scatterData.groups
        })

        let $linechart = document.getElementById('linechart');
        let scrollMax = lineGraphSetting.lineGraphWidth - $linechart.offsetWidth;

        $linechart.addEventListener('scroll', function (event) {
            console.log(this.scrollLeft);
            let index = this.scrollLeft / scrollMax * 254;
            let eventsPeople = new Set();
            let eventsExtent = toExtent(index);
            // console.log(data.scatterData.scatterData);
            data.scatterData.scatterData.forEach(e => {
                if (e.eventId <= eventsExtent[1] && e.eventId > eventsExtent[0]) {
                    eventsPeople.add(e.person)
                }
            });
            scatterGraph.update( eventsPeople, eventsExtent);
        })

        function toExtent(i) {
            if (i-10 <= 0) {
                return [0,50]
            } else if (i+34>=259){
                return [225,259];
            } else {
                return [i-10,i+30]
            }
        }

        let treemap = new TreeMap({
            element:d3.select('#treemap'),
            data: data.hierarchyData
        })
    })
    .catch(err => console.log(err))