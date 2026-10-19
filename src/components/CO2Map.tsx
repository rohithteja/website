'use client'

import { useEffect } from "react";
import { MapContainer, CircleMarker, useMap } from "react-leaflet";
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";

// OpenFreeMap: free, open-source vector tiles with no API key or registration.
const BASEMAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

const BASEMAP_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> ' +
  '<a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">&copy; OpenMapTiles</a> ' +
  'Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

function OpenFreeMapBasemap() {
  const map = useMap();

  useEffect(() => {
    const basemap = maplibreGL({
      style: BASEMAP_STYLE,
      attributionControl: false,
    }).addTo(map);

    map.attributionControl.addAttribution(BASEMAP_ATTRIBUTION);

    return () => {
      map.removeLayer(basemap);
      map.attributionControl.removeAttribution(BASEMAP_ATTRIBUTION);
    };
  }, [map]);

  return null;
}

interface CityData {
  city: string;
  population_2020: number;
  state: string;
  population_state: number;
  gdp_2020: number;
  urban_area_km2: number;
  road_length_km: number;
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
    
    // Calculate 35th percentile (bottom 35% = low) and 75th percentile (top 25% = high)
    const percentile35Index = Math.floor(sortedCO2.length * 0.35);
    const percentile75Index = Math.floor(sortedCO2.length * 0.75);
    
    const lowThreshold = sortedCO2[percentile35Index];
    const highThreshold = sortedCO2[percentile75Index];
    
    if (co2 > highThreshold) return '#dc2626'; // bright red - high (top 25%)
    if (co2 > lowThreshold) return '#f59e0b'; // amber/yellow - medium (35th-75th percentile)
    return '#10b981'; // green - low (bottom 35%)
  };

  const getCircleRadius = (population: number) => {
    const maxPop = Math.max(...cityData.map(city => city.population_2020));
    return Math.max(6, (population / maxPop) * 15);
  };

  return (
    <div className="h-96 rounded-lg overflow-hidden isolate" data-lenis-prevent>
      <MapContainer 
        center={[22.5, 78.9]} 
        zoom={4} 
        style={{ height: "100%", width: "100%" }}
        className="relative z-0 rounded-lg"
      >
        <OpenFreeMapBasemap />
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
          />
        ))}
      </MapContainer>
    </div>
  );
}
