import React from "react";
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiThunderstorm, WiFog } from "react-icons/wi";

const WeatherIcon = ({ condition, size = 50}) =>{
    const getIcon = () =>{
        if(condition.includes('clear')) return <WiDaySunny size={size} />;
        if(condition.includes('rain')) return < WiRain size ={size}/>;
        if(condition.includes('snow')) return <WiSnow size ={size} />;
        if(condition.includes('cloud')) return <WiCloudy size ={size} />;
        if(condition.includes('thunderstorm')) return <WiThunderstorm size={size} />;
        if(condition.includes('fog') || condition.includes('mist')) return  <WiFog size={size} />;
        return <WiDaySunny size={size} />;

    };
    return <div className="weather-icon">{getIcon()}</div>;
};
export default WeatherIcon;