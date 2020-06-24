import React from 'react';
import './App.css';
import Forecast from './Forecast';

class ForecastRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayList: [],
            weatherQueue: [],
            batch1ids: [],
            batch2ids: [],
            remainingIds: [],
            idMap: []
        };
    }

    //read current weatherQueue from express server
    async componentDidMount() {
        const response = await fetch('http://localhost:3001');
        let weatherJson = await response.json();
        this.setState({
            weatherQueue: weatherJson
        });
        this.idParse();
        if (this.state.idMap.length > 4) {
            setTimeout(this.batch2Update.bind(this), 40000);
        }
    }

    //parse location ids from viewer records in weatherQueue
    idParse() {
        const idResponse = this.state.weatherQueue.map(viewer => viewer.id);
        this.setState({
            idMap: idResponse
        })
        this.batchBuild(this.state.idMap);

    }

    batch2Update() {
        this.setState({
            displayList: this.state.batch2ids
        })
        if (this.state.idMap.length > 8) {
            setTimeout(this.clearScene.bind(this), 40000);
        }
    }

    clearScene() {
        this.setState({
            displayList: null
        });
        setTimeout(this.renderRemaining.bind(this), 5000);
    }

    renderRemaining() {
        this.setState({
            displayList: this.state.remainingIds
        });
    }



    //create batch of ids
    batchBuild(ids) {
        const ids1 = ids.slice(0, 4);
        const ids2 = ids.slice(4, 8);
        const remaining = ids.slice(8, 15);
        let batch1Array = [];
        let batch2Array = [];
        let remainingArray = [];

        for (let i in ids1) {
            batch1Array.push(<Forecast key={ids1[i]} location={ids1[i]} />);
        }

        for (let j in ids2) {
            batch2Array.push(<Forecast key={ids2[j]} location={ids2[j]} />);
        }

        for (let k in remaining) {
            remainingArray.push(<Forecast key={ids2[k]} location={remaining[k]} />);
        }

        this.setState({
            displayList: batch1Array,
            batch2ids: batch2Array,
            remainingIds: remainingArray
        });
    }

    render() {
        return (
            <div>
                {this.state.displayList}
            </div>
        )
    }
}

export default ForecastRender;