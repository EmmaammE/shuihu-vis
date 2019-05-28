import { wordcloudSetting } from "../../util/setting";
import "./wordcloud.css"

export default class wordcloud {
    constructor(props) {
        // this.data = props.data;
        // this.element = props.element.append('svg')
        //     .attr('width', wordcloudSetting.width)
        //     .attr('height', wordcloudSetting.height)
        //     .append('g');
        // this.draw();
        this.element = document.querySelector('.word-cloud');
        this.allEvents = props.allEvents;
    }

    draw() {
        var $ul = document.createElement('ul');
        $ul.className = 'word-cloud';
        var _characters = '';

        for (let index = 0; index < this.data.personArr.length; index++) {
             if (index > 9) {
                 _characters += '...';
                 break;
             }
            const element = this.data.personArr[index];
            _characters += element + " ";
        }
        console.log(this.data);
        $ul.innerHTML = `
                <li class="word-cloud__word  word-cloud__word--x-small">${this.data["事件"]}</li>
                <li class="word-cloud__word  word-cloud__word--small">${_characters}</li>
                <li class="word-cloud__word  word-cloud__word--x-large">${this.data["章回"]}</li>
                <li class="word-cloud__word  word-cloud__word--large">${this.data["地点（可确定）"]}</li>
                `;
        document.querySelector('.word-cloud').replaceWith($ul);
    }

    updateGraph(value) {
        this._data = this.allEvents[value-1];
        this.draw();
    }

    set _data(value) {
       this.data = value;
    }

    set _element(value) {
        this.element = value;
    }
}