"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import IrrigationStatusCards from "../components/IrrigationStatus";

export default function HomePage() {
  const [weatherSummary, setWeatherSummary] = useState({
    totalRain: 0,
    avgHumidity: 0,
    avgEvapotranspiration: 0,
  });

  const [sensorData, setSensorData] = useState({
    humidity: 0,
    conductivity: 0,
    env_humidity: 0,
    env_temperature: 0,
    temperature: 0,
  });

  const [modelResponse, setModelResponse] = useState("");
  const [dataCollectionPaused, setDataCollectionPaused] = useState(false);

  const baseUrl =
    "https://recommendationmodel-cfb9fycaguhpegbs.spaincentral-01.azurewebsites.net";

  const prepareModelData = useCallback(() => {
    const data = {
      features: [
        sensorData.conductivity,
        sensorData.humidity,
        sensorData.temperature,
        sensorData.env_humidity,
        sensorData.env_temperature,
        weatherSummary.totalRain,
        weatherSummary.avgHumidity,
        weatherSummary.avgEvapotranspiration,
      ],
    };

    // Log the prepared data to ensure it's correct
    console.log("Prepared Model Data:", data);

    return data;
  }, [sensorData, weatherSummary]);

  const sendDataToModel = useCallback(async () => {
    const url = `${baseUrl}/predict_irrigation`;
    const data = prepareModelData();

    console.log("Sending data to model:", data); // Log data being sent

    try {
      const response = await axios.post(url, data);
      console.log("Model Response:", response); // Log the response from the model
      setModelResponse(response.data.prediction || "No response message provided.");
    } catch (error) {
      console.error("Error sending data to the model:", error);
      setModelResponse("An error occurred while communicating with the model.");
    }
  }, [prepareModelData]);

  useEffect(() => {
    // Commenting out the sensor data collection part and adding random values for now.
    const randomSensorData = () => {
      return {
        humidity: Math.round(Math.random() * 100), // Random humidity between 0 and 100
        conductivity: Math.random() * 10, // Random conductivity value (0 - 10)
        env_humidity: Math.round(Math.random() * 100), // Random environment humidity between 0 and 100
        env_temperature: Math.random() * 40, // Random environment temperature (0 - 40°C)
        temperature: Math.random() * 35, // Random soil temperature (0 - 35°C)
      };
    };

    const fetchWeatherData = async () => {
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
    
        const totalRain = hourly.rain.reduce((sum: number, value: number) => sum + value, 0);
        const avgHumidity =
          hourly.relative_humidity_2m.reduce((sum: number, value: number) => sum + value, 0) /
          hourly.relative_humidity_2m.length;
        const avgEvapotranspiration =
          hourly.et0_fao_evapotranspiration.reduce((sum: number, value: number) => sum + value, 0) /
          hourly.et0_fao_evapotranspiration.length;
    
        setWeatherSummary({
          totalRain: Number(totalRain.toFixed(2)),
          avgHumidity: Number(avgHumidity.toFixed(2)),
          avgEvapotranspiration: Number(avgEvapotranspiration.toFixed(2)),
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    const startDataCollection = () => {
      if (!dataCollectionPaused) {
        console.log("Starting data collection...");
        fetchWeatherData();
        
        // Set random sensor data for now
        setSensorData(randomSensorData());

        // Send data to the model
        sendDataToModel();

        // Pause for an hour
        setDataCollectionPaused(true);

        setTimeout(() => {
          console.log("Resuming data collection...");
          setDataCollectionPaused(false);
        }, 60 * 60 * 1000); // 1 hour
      }
    };

    startDataCollection();

    return () => {
      setDataCollectionPaused(true);
    };
  }, [sendDataToModel, dataCollectionPaused]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather and Sensor Data</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Weather Summary (Next 3 Days)</h2>
          <p>Total Rain: {weatherSummary.totalRain} mm</p>
          <p>Average Humidity: {weatherSummary.avgHumidity}%</p>
          <p>Average Evapotranspiration: {weatherSummary.avgEvapotranspiration} mm</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Sensor Readings</h2>
          <p>Current Humidity: {sensorData.humidity}%</p>
          <p>Current Conductivity: {sensorData.conductivity}</p>
          <p>Environment Temperature: {sensorData.env_temperature}°C</p>
          <p>Environment Humidity: {sensorData.env_humidity}%</p>
          <p>Soil Temperature: {sensorData.temperature}°C</p>
        </div>
      </div>

      <IrrigationStatusCards modelResponse={modelResponse} />
    </div>
  );
}
