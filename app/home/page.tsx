"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import IrrigationStatusCards from "../components/IrrigationStatus";

export default function HomePage() {
  // Weather and sensor states
  const [weatherSummary, setWeatherSummary] = useState({
    totalRain: 0,
    avgHumidity: 0,
    avgEvapotranspiration: 0,
  });

  const [sensorData, setSensorData] = useState({
    currentHumidity: 0,
    currentConductivity: 0,
    environmentHumidity: 0,
    environmentTemperature: 0,
    temperature: 0, // Added soil temperature
  });

  // Model response state
  const [modelResponse, setModelResponse] = useState("");

  // Base URL for simulations
  const baseUrl = "https://recommendationmodel-cfb9fycaguhpegbs.spaincentral-01.azurewebsites.net";

  useEffect(() => {
    // Fetch weather and start event sources
    async function fetchWeatherData() {
      const params = {
        latitude: 33.5625,
        longitude: -7.625,
        hourly: ["relative_humidity_2m", "rain", "et0_fao_evapotranspiration"],
        forecast_days: 3,
      };
      const url = "https://api.open-meteo.com/v1/forecast";

      try {
        const response = await axios.get(url, { params });
        const hourly = response.data.hourly;

        // Aggregate calculations
        const totalRain = hourly.rain.reduce((sum: any, value: any) => sum + value, 0);
        const avgHumidity =
          hourly.relative_humidity_2m.reduce((sum: any, value: any) => sum + value, 0) / hourly.relative_humidity_2m.length;
        const avgEvapotranspiration =
          hourly.et0_fao_evapotranspiration.reduce((sum: any, value: any) => sum + value, 0) /
          hourly.et0_fao_evapotranspiration.length;

        setWeatherSummary({
          totalRain: Number(totalRain.toFixed(2)),
          avgHumidity: Number(avgHumidity.toFixed(2)),
          avgEvapotranspiration: Number(avgEvapotranspiration.toFixed(2)),
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }

    // Sensor simulation event listeners
    const startEventSource = (endpoint: string, key: string) => {
      const source = new EventSource(`${baseUrl}${endpoint}`);
      source.onmessage = (event) => {
        console.log(`Data from ${endpoint}:`, event.data); // Log raw data
        try {
          const parsedData = JSON.parse(event.data);
          const value = Math.round(parsedData[key]);
          if (!isNaN(value)) {
            setSensorData((prev) => ({
              ...prev,
              [key]: value,
            }));
          } else {
            console.warn(`Key "${key}" not found in data from ${endpoint}`);
          }
        } catch (error) {
          console.error(`Error parsing data from ${endpoint}:`, error);
        }
      };
    
      connect();
      return source;
    };
    

    const sources = [
      startEventSource("/start_humidity_simulation", "currentHumidity"),
      startEventSource("/start_conductivity_simulation", "currentConductivity"),
      startEventSource("/start_env_humidity_simulation", "environmentHumidity"),
      startEventSource("/start_env_temperature_simulation", "environmentTemperature"),
      startEventSource("/start_temp_simulation", "temperature"), // Added soil temperature
    ];

    fetchWeatherData();

    return () => {
      sources.forEach((source) => source.close());
    };
  }, []);

  // Prepare data for the model
  const prepareModelData = () => ({
    features: [
      sensorData.currentConductivity,
      sensorData.currentHumidity,
      sensorData.temperature, // Use soil temperature
      sensorData.environmentHumidity,
      sensorData.environmentTemperature,
      weatherSummary.totalRain,
      weatherSummary.avgHumidity,
      weatherSummary.avgEvapotranspiration,
    ],
  });

  // Function to send data to the model
  const sendDataToModel = async () => {
    const url = `${baseUrl}/predict_irrigation`;
    const data = prepareModelData();

    try {
      const response = await axios.post(url, data);
      setModelResponse(response.data.message || "No response message provided.");
    } catch (error) {
      console.error("Error sending data to the model:", error);
      setModelResponse("An error occurred while communicating with the model.");
    }
  };

  return (
    <div>
      <h1>Weather and Sensor Data</h1>

      <h2>Weather Summary (Next 3 Days)</h2>
      <p>Total Rain: {weatherSummary.totalRain} mm</p>
      <p>Average Humidity: {weatherSummary.avgHumidity}%</p>
      <p>Average Evapotranspiration: {weatherSummary.avgEvapotranspiration} mm</p>

      <h2>Sensor Readings</h2>
      <p>Current Humidity: {sensorData.currentHumidity}%</p>
      <p>Current Conductivity: {sensorData.currentConductivity}</p>
      <p>Environment Temperature: {sensorData.environmentTemperature}°C</p>
      <p>Environment Humidity: {sensorData.environmentHumidity}%</p>
      <p>Soil Temperature: {sensorData.temperature}°C</p> {/* Display soil temperature */}

      <button onClick={sendDataToModel}>Send Data to Model</button>

      {modelResponse && (
        <div>
          <h3>Model Response</h3>
          <p>{modelResponse}</p>
        </div>
      )}

<IrrigationStatusCards modelResponse={modelResponse} />

    </div>
  );
}
