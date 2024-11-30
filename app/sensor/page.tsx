"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale);

// Define an explicit interface for the chart data
interface ChartDataState {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}
interface ApiResponse {
    temperature: number;
  }
  

const SensorPage: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataState>({
    labels: [], // Timestamps
    datasets: [
      {
        label: "Temperature",
        data: [], // Temperature values
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          "https://recommendationmodel-cfb9fycaguhpegbs.spaincentral-01.azurewebsites.net/start_temp_simulation"
        );
        const { temperature } = response.data;
  
        setChartData((prevState) => {
          const newLabels = [...prevState.labels, new Date().toLocaleTimeString()];
          const newData = [...prevState.datasets[0].data, temperature];
  
          const trimmedLabels = newLabels.slice(-10);
          const trimmedData = newData.slice(-10);
  
          return {
            labels: trimmedLabels,
            datasets: [
              {
                ...prevState.datasets[0],
                data: trimmedData,
              },
            ],
          };
        });
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };
  
    const interval = setInterval(fetchTemperature, 1000);
  
    return () => clearInterval(interval);
  }, []);
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dynamic Temperature Chart</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: "category",
                title: {
                  display: true,
                  text: "Time",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Temperature (°C)",
                },
                beginAtZero: true,
              },
            },
          }}
          height={400}
        />
      </div>
    </div>
  );
};

export default SensorPage;
