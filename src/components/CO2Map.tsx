'use client'

import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface CityData {
  city: string;
  population_2020: number;
  state: string;
  population_state: number;
  gdp_2020: number;
  urban_area_km2: number;
  road_length_km: number;
  year: number;
  co2: number;
  lat: number;
  lon: number;
}

interface CO2MapProps {
  cityData: CityData[];
  onCityHover: (city: CityData | null) => void;
}

export default function CO2Map({ cityData, onCityHover }: CO2MapProps) {
  const getCircleColor = (co2: number) => {
    // Sort CO2 values to find percentiles
    const sortedCO2 = cityData.map(city => city.co2).sort((a, b) => a - b);
    
    // Calculate 35th percentile (bottom 35% = low) and 70th percentile (top 30% = high)
    const percentile35Index = Math.floor(sortedCO2.length * 0.35);
    const percentile70Index = Math.floor(sortedCO2.length * 0.75);
    
    const lowThreshold = sortedCO2[percentile35Index];
    const highThreshold = sortedCO2[percentile70Index];
    
    if (co2 > highThreshold) return '#dc2626'; // bright red - high (top 30%)
    if (co2 > lowThreshold) return '#f59e0b'; // amber/yellow - medium (35th-70th percentile)
    return '#10b981'; // green - low (bottom 35%)
  };

  const getCircleRadius = (population: number) => {
    const maxPop = Math.max(...cityData.map(city => city.population_2020));
    return Math.max(6, (population / maxPop) * 15);
  };

  return (
    <div className="h-96 rounded-lg overflow-hidden">
      <MapContainer 
        center={[22.5, 78.9]} 
        zoom={4} 
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {cityData.map((city, index) => (
          <CircleMarker
            key={index}
            center={[city.lat, city.lon]}
            radius={getCircleRadius(city.population_2020)}
            color="#ffffff"
            weight={1}
            fillColor={getCircleColor(city.co2)}
            fillOpacity={0.8}
            eventHandlers={{
              mouseover: () => onCityHover(city),
              mouseout: () => onCityHover(null),
            }}
          >
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
