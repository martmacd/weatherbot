import React from 'react';
import './App.css';
import * as keys from './keys.json';

class Forecast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentJSON: null,
            forecastJSON: null,
            day1: {},
            day2: {},
            day3: {},
            metric: null
        };
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.loadData();
        }
    }

    //Fetch raw data from openweather API and save to JSONs using locationID and API key
    async loadData() {
        let currentResponse = "";
        let forecastResponse = "";
        try {
            currentResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?id=${this.props.location}&APPID=${keys.weatherApi}&units=metric`);
            forecastResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${this.props.location}&APPID=${keys.weatherApi}&units=metric`);
            this.setState({
                currentJSON: await currentResponse.json(),
                forecastJSON: await forecastResponse.json()
            })
            this.modifyState();
        }
        catch (error) {
            console.log(error);
            return (`Problem calling OpenweatherAPI.`);
        }
    }


    //convert to Farenheit for US
    renderTemperature(temp) {
        const convertedTemp = this.state.currentJSON.sys.country === 'US' ? ((temp * (9 / 5)) + 32) : temp;
        return parseInt(convertedTemp).toFixed(0);
    }

    modifyState() {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const state = {
            ...this.state
        };

        //Assign correct metric for on screen display
        state.metric = this.state.currentJSON.sys.country === 'US' ? 'F' : 'C';

        //Assign Current Weather values to day1 object and render on index.html
        state.day1.day = new Date((this.state.currentJSON.dt + this.state.currentJSON.timezone) * 1000).getDay();
        state.day1.currentTemp = this.renderTemperature((this.state.currentJSON.main.temp).toFixed(0));
        state.day1.lowTemp = this.renderTemperature((this.state.currentJSON.main.temp_min).toFixed(0));
        state.day1.highTemp = this.renderTemperature((this.state.currentJSON.main.temp_max).toFixed(0));
        if ((this.state.currentJSON.weather[0].icon === "50d") || (this.state.currentJSON.weather[0].icon ==="50n")) {
            state.day1.icon = `/img/animated/50d.png`;
        }
        else {
            state.day1.icon = `/img/animated/${this.state.currentJSON.weather[0].icon}.svg`;
        }
        //use the commented line below for static icons served from openweather 
        //state.day1.icon = `http://openweathermap.org/img/wn/${this.state.currentJSON.weather[0].icon}@2x.png`;
        state.day1.dayString = days[state.day1.day];
        state.day1.conditions = (this.state.currentJSON.weather[0].main);


        //Assign Forecast properties for next 2 days to day2 and day3 objects

        //adjust Unix Time Code using offset property from API return
        state.day2.day = new Date((this.state.forecastJSON.list[7].dt + this.state.forecastJSON.city.timezone) * 1000).getDay();
        state.day2.dayString = days[state.day2.day];

        //Calculate lowest Low temperature across the day

        let day2LowTemps = [];
        for (let i in this.state.forecastJSON.list) {
            let testDay = new Date(this.state.forecastJSON.list[i].dt * 1000).getDay();
            if (testDay === state.day2.day) {
                day2LowTemps.push(this.state.forecastJSON.list[i].main.temp_min);
            }
        }

        day2LowTemps.sort(function (a, b) { return a - b });
        state.day2.lowTemp = this.renderTemperature(day2LowTemps[0].toFixed(0));

        //Calculate highest High temperature across the day

        let day2HighTemps = [];
        let middayCount = 0;
        for (let i in this.state.forecastJSON.list) {
            let testDay = new Date(this.state.forecastJSON.list[i].dt * 1000).getDay();
            if (testDay === state.day2.day) {
                day2HighTemps.push(this.state.forecastJSON.list[i].main.temp_max);
                middayCount++;
                if (middayCount === 4) {
                    if (this.state.forecastJSON.list[i].weather[0].icon === "50d") {
                        state.day2.icon = `/img/animated/50d.png`;
                    }
                    else {
                        //Change nighttime icons to daytime for day2 & 3 renders
                        const iconDayify = (`${this.state.forecastJSON.list[i].weather[0].icon}`.slice(0,-1)) + ("d");
                        state.day2.icon = `/img/animated/${iconDayify}.svg`;
                    }
                    // state.day2.icon = `http://openweathermap.org/img/wn/${this.state.forecastJSON.list[i].weather[0].icon}@2x.png`;
                }
            }
        }

        day2HighTemps.sort(function (a, b) { return b - a });
        state.day2.highTemp = this.renderTemperature(day2HighTemps[0].toFixed(0));

        //
        //Initialize day3 properties
        //

        state.day3.day = new Date((this.state.forecastJSON.list[15].dt + this.state.forecastJSON.city.timezone) * 1000).getDay();
        state.day3.dayString = days[state.day3.day];

        //Calculate lowest Low temperature across the day

        let day3LowTemps = [];
        for (let i in this.state.forecastJSON.list) {
            let testDay = new Date(this.state.forecastJSON.list[i].dt * 1000).getDay();
            if (testDay === state.day3.day) {
                day3LowTemps.push(this.state.forecastJSON.list[i].main.temp_min);
            }
        }

        day3LowTemps.sort(function (a, b) { return a - b });
        state.day3.lowTemp = this.renderTemperature(day3LowTemps[0].toFixed(0));

        //Calculate highest High temperature across the day

        let day3HighTemps = [];
        let middayCount2 = 0;
        for (let i in this.state.forecastJSON.list) {
            let testDay = new Date(this.state.forecastJSON.list[i].dt * 1000).getDay();
            if (testDay === state.day3.day) {
                day3HighTemps.push(this.state.forecastJSON.list[i].main.temp_max);
                middayCount2++;
                if (middayCount2 === 4) {
                    if (this.state.forecastJSON.list[i].weather[0].icon === "50d") {
                        state.day3.icon = `/img/animated/50d.png`;
                    }
                    else {
                        const iconDayify = (`${this.state.forecastJSON.list[i].weather[0].icon}`.slice(0,-1)) + ("d");
                        state.day3.icon = `/img/animated/${iconDayify}.svg`;
                    }
                    // state.day3.icon = `http://openweathermap.org/img/wn/${this.state.forecastJSON.list[i].weather[0].icon}@2x.png`;
                }
            }
        }

        day3HighTemps.sort(function (a, b) { return b - a });
        state.day3.highTemp = this.renderTemperature(day3HighTemps[0].toFixed(0));

        //setState all values updated by state
        this.setState(state);
    }

    render() {
        //check for initial FETCH to have completed before rendering

        if (!this.state.currentJSON) {
            return <div></div>;
        }

        return <div className="forecastrender">
            <div>
                <h5 className="cityName">{this.state.currentJSON.name}</h5>
                <img className="iconMain" src={this.state.day1.icon} alt="Icon for Day 1" />
                <h5 className="currentTemp">{this.state.day1.currentTemp}°{this.state.metric} / {this.state.day1.conditions}</h5>
            </div>
            <div>
                <h4>{this.state.day1.dayString}</h4>
                <img className="iconOther" src={this.state.day1.icon} alt="Icon for Day 1" />
                <div>
                    <h5 className="inline-element-left">{this.state.day1.lowTemp}°{this.state.metric}</h5>
                    <h5 className="inline-element-right">{this.state.day1.highTemp}°{this.state.metric}</h5>
                </div>
            </div>
            <div>
                <h4>{this.state.day2.dayString}</h4>
                <img className="iconOther" src={this.state.day2.icon} alt="Icon for Day 2" />
                <div>
                    <h5 className="inline-element-left">{this.state.day2.lowTemp}°{this.state.metric}</h5>
                    <h5 className="inline-element-right">{this.state.day2.highTemp}°{this.state.metric}</h5>
                </div>
            </div>
            <div>
                <h4>{this.state.day3.dayString}</h4>
                <img className="iconOther" src={this.state.day3.icon} alt="Icon for Day 3" />
                <div>
                    <h5 className="inline-element-left">{this.state.day3.lowTemp}°{this.state.metric}</h5>
                    <h5 className="inline-element-right">{this.state.day3.highTemp}°{this.state.metric}</h5>
                </div>
            </div>
        </div>
    }

}

export default Forecast;