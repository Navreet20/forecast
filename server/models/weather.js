import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
    location:{
        type: String,
        required: true
    },
    coordinates: {
        lat: Number,
        lon: Number
    },
    dateRange:{
        start: {type: Date, required: true},
        end:  {type: Date, required: true}
    },
    weatherData: {
        current: { type: Object },   
        forecast: { type: Object }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});
export default mongoose.model('WeatherQuery', weatherSchema);