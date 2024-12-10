'use client';

import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MicIcon, XCircleIcon } from 'lucide-react';

// Mock Data (unchanged)
const mockData = {
  weather_summary: {
    total_rain: 0, // in mm
    avg_humidity: 75.01, // in %
    avg_evapotranspiration: 0.07, // in mm
  },
  sensor_readings: {
    current_humidity: 23, // in %
    current_conductivity: 0.5, // unitless
    env_temperature: 10, // in °C
    env_humidity: 20, // in %
    soil_temperature: 10, // in °C
  },
};

// Generate prompt
const generatePrompt = (
  data: {
    weather_summary: {
      total_rain: any;
      avg_humidity: any;
      avg_evapotranspiration: any;
    };
    sensor_readings: {
      current_humidity: any;
      current_conductivity: any;
      env_temperature: any;
      env_humidity: any;
      soil_temperature: any;
    };
  },
  remarks: string
) => {
  return `
Based on the following environmental data:

- Weather Summary (next three days):
  - Total Rain: ${data.weather_summary.total_rain} mm
  - Average Humidity: ${data.weather_summary.avg_humidity}%
  - Average Evapotranspiration: ${data.weather_summary.avg_evapotranspiration} mm

- Sensor Readings:
  - Current Humidity: ${data.sensor_readings.current_humidity}%
  - Current Conductivity: ${data.sensor_readings.current_conductivity}
  - Environmental Temperature: ${data.sensor_readings.env_temperature}°C
  - Environmental Humidity: ${data.sensor_readings.env_humidity}%
  - Soil Temperature: ${data.sensor_readings.soil_temperature}°C

Remarks: ${remarks}.

Please provide clear and direct advice focusing on improving agricultural conditions or optimizing resource usage. Use directive language such as "You should..." or "Ensure that you...".
  `;
};

const VoiceAssistantEnglish: React.FC = () => {
  const [response, setResponse] = useState<string>('Listening...');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [remarks, setRemarks] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

  const testApiKey = async (remarks: string): Promise<string> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = generatePrompt(mockData, remarks);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('API key is not working. Error:', error);
      return 'API key verification failed.';
    }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.map((v) => v.lang));
      };
    }

    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'en-US';

      speechRecognition.onresult = async (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setResponse(`You said: ${spokenText}`);
        setRemarks(spokenText);
        const aiResponse = await testApiKey(spokenText);
        setResponse(aiResponse);
        respondWithVoice(aiResponse);
      };

      speechRecognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setResponse(`Error: ${event.error}`);
        setIsRecording(false);
      };

      speechRecognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(speechRecognition);
    } else {
      setResponse('Speech recognition is not supported in this browser.');
    }
  }, []);

  const handleStartRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
      setResponse('Listening...');
    } else {
      setResponse('Speech recognition not initialized.');
    }
  };

  const handleStopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const respondWithVoice = (text: string) => {
    const cleanedText = text.replace(/\*/g, '').trim();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter((voice) =>
        voice.lang.startsWith('en') || voice.name.toLowerCase().includes('english')
      );

      if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0];
      }

      utterance.rate = 0.9;

      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('Speech synthesis started');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('Speech synthesis ended');
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported in this browser.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <div className="text-center mb-8">
        <div className="w-64 h-64 rounded-full border-4 border-gray-300 flex items-center justify-center mx-auto mb-4">
          <p className="text-lg text-center">{""}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleStartRecording}
          disabled={isRecording || isSpeaking}
          className="p-3 bg-green-500 text-white rounded-full disabled:opacity-50"
        >
          <MicIcon size={24} />
        </button>
        <button
          onClick={handleStopRecording}
          disabled={!isRecording}
          className="p-3 bg-red-500 text-white rounded-full disabled:opacity-50"
        >
          <XCircleIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export default VoiceAssistantEnglish;
