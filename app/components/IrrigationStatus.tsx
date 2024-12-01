import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Droplet, ShieldOff } from "lucide-react";

// Define the type for the card configurations
type CardConfig = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  activeClassName: string;
};

// Define the props type
type IrrigationStatusCardsProps = {
  modelResponse: string;
};

const IrrigationStatusCards: React.FC<IrrigationStatusCardsProps> = ({ modelResponse }) => {
  // Predefined card configurations
  const cardConfigs: CardConfig[] = [
    {
      key: "Alert",
      label: "Alert",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      activeClassName: "border-red-500 bg-red-50"
    },
    {
      key: "No adjustment",
      label: "No Adjustment",
      icon: CheckCircle,
      iconColor: "text-green-500",
      activeClassName: "border-green-500 bg-green-50"
    },
    {
      key: "Irrigation ON",
      label: "Irrigation On",
      icon: Droplet,
      iconColor: "text-blue-500",
      activeClassName: "border-blue-500 bg-blue-50"
    },
    {
      key: "Irrigation OFF",
      label: "Irrigation Off",
      icon: ShieldOff,
      iconColor: "text-gray-500",
      activeClassName: "border-gray-500 bg-gray-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {cardConfigs.map((config) => (
        <Card
          key={config.key}
          className={`transition-all duration-300 border-2 ${
            modelResponse === config.key 
              ? `${config.activeClassName} border-opacity-100` 
              : 'border-opacity-20 bg-white'
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
            <config.icon 
              className={`h-6 w-6 ${
                modelResponse === config.key 
                  ? config.iconColor 
                  : 'text-muted-foreground'
              }`} 
            />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              modelResponse === config.key 
                ? (config.key === "Alert" ? "text-red-600" : 
                   config.key === "No adjustment" ? "text-green-600" : 
                   config.key === "Irrigation ON" ? "text-blue-600" : "text-gray-600")
                : "text-gray-400"
            }`}>
              {modelResponse === config.key ? "Active" : "Inactive"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IrrigationStatusCards;