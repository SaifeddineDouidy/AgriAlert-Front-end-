"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import IrrigationStatusCards from "../components/IrrigationStatus";

export default function HomePage() {
  const [modelResponse, setModelResponse] = useState("");

  const baseUrl =
    "https://recommendationmodel-cfb9fycaguhpegbs.spaincentral-01.azurewebsites.net";

  // Prepare static data for the model
  const prepareModelData = useCallback(() => ({
    features: [
      723.0, // Static Conductivity
      31.9,  // Static Humidity
      29.1,  // Static Soil Temperature
      30.0,  // Static Environment Humidity
      40.6,  // Static Environment Temperature
      23.1,  // Static Total Rain
      85.22222222222223, // Static Average Humidity
      0.1443055555555555, // Static Average Evapotranspiration
    ],
  }), []);

  // Send static data to the model
  const sendDataToModel = useCallback(() => {
    const data = prepareModelData();

    console.log("Sending static data to the model:", data);

    axios
      .post(`${baseUrl}/predict_irrigation`, data)
      .then((response) => {
        console.log("Model response received:", response.data);
        setModelResponse(response.data.message || "No response message provided.");
      })
      .catch((error) => {
        console.error("Error sending static data to the model:", error);
        setModelResponse("An error occurred while sending data to the model.");
      });
  }, [prepareModelData]);

  // Trigger model prediction on component mount
  useEffect(() => {
    sendDataToModel();
  }, [sendDataToModel]);

  // Render UI
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Irrigation Recommendation</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Static Weather Summary</h2>
          <p>Total Rain: 23.1 mm</p>
          <p>Average Humidity: 85.22%</p>
          <p>Average Evapotranspiration: 0.14 mm</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Static Sensor Readings</h2>
          <p>Current Humidity: 31.9%</p>
          <p>Current Conductivity: 723.0</p>
          <p>Environment Temperature: 40.6°C</p>
          <p>Environment Humidity: 30.0%</p>
          <p>Soil Temperature: 29.1°C</p>
        </div>
      </div>

      <IrrigationStatusCards modelResponse={modelResponse} />
    </div>
  );
}
