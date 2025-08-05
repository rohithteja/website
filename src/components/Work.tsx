'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { csvParse } from "d3-dsv";
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

export default function Work() {
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data.csv")
      .then(response => response.text())
      .then(csvText => {
        const parsedData = csvParse(csvText, (d) => ({
          city: d.city || '',
          population_2020: +d.population_2020 || 0,
          state: d.state || '',
          population_state: +d.population_state || 0,
          gdp_2020: +d['GDP_2020(billion USD)'] || 0,
          urban_area_km2: +d.urban_area_km2 || 0,
          road_length_km: +d.road_length_km || 0,
          year: +d.year || 0,
          co2: +d.co2 || 0,
          lat: +d.lat || 0,
          lon: +d.lon || 0,
        })) as CityData[];
        setCityData(parsedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading CSV data:", error);
        setLoading(false);
      });
  }, []);

  const getCircleColor = (co2: number) => {
    const maxCO2 = Math.max(...cityData.map(city => city.co2));
    const intensity = co2 / maxCO2;
    
    if (intensity > 0.8) return '#ef4444'; // red
    if (intensity > 0.6) return '#f97316'; // orange
    if (intensity > 0.4) return '#eab308'; // yellow
    if (intensity > 0.2) return '#22d3ee'; // cyan
    return '#10b981'; // green
  };

  const getCircleRadius = (population: number) => {
    const maxPop = Math.max(...cityData.map(city => city.population_2020));
    return Math.max(3, (population / maxPop) * 15);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const totalCO2 = cityData.reduce((sum, city) => sum + city.co2, 0);
  const avgCO2 = cityData.length > 0 ? totalCO2 / cityData.length : 0;
  const totalPopulation = cityData.reduce((sum, city) => sum + city.population_2020, 0);

  if (loading) {
    return (
      <section id="work" className="bg-gray-900 w-full min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </section>
    );
  }

  return (
    <section id="work" className="bg-gray-900 w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">India Cities Traffic Emissions Dashboard</h2>
          <p className="text-gray-300 text-lg">Interactive map showing CO2 emissions from traffic across major Indian cities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Total Cities</h3>
            <p className="text-2xl font-bold text-white">{cityData.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Total CO2 Emissions</h3>
            <p className="text-2xl font-bold text-red-400">{formatNumber(totalCO2)} tons</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Average CO2 per City</h3>
            <p className="text-2xl font-bold text-orange-400">{formatNumber(avgCO2)} tons</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Total Population</h3>
            <p className="text-2xl font-bold text-blue-400">{formatNumber(totalPopulation)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white text-lg font-semibold mb-4">Cities Map</h3>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer 
                  center={[22.5, 78.9]} 
                  zoom={5} 
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
                        mouseover: () => setSelectedCity(city),
                        mouseout: () => setSelectedCity(null),
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <h4 className="font-bold text-lg">{city.city}</h4>
                          <p><strong>State:</strong> {city.state}</p>
                          <p><strong>Population:</strong> {formatNumber(city.population_2020)}</p>
                          <p><strong>CO2 Emissions:</strong> {formatNumber(city.co2)} tons</p>
                          <p><strong>GDP:</strong> ${city.gdp_2020.toFixed(1)}B USD</p>
                          <p><strong>Urban Area:</strong> {city.urban_area_km2.toFixed(1)} km²</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                <div className="flex items-center space-x-4">
                  <span>CO2 Emissions:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Low</span>
                    <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                    <span>Medium</span>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>High</span>
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Very High</span>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Extreme</span>
                  </div>
                </div>
                <div>
                  <span>Circle size = Population</span>
                </div>
              </div>
            </div>
          </div>

          {/* City Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-fit">
              <h3 className="text-white text-lg font-semibold mb-4">
                {selectedCity ? `${selectedCity.city} Details` : 'City Information'}
              </h3>
              {selectedCity ? (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">City:</span>
                    <span className="text-white font-medium">{selectedCity.city}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">State:</span>
                    <span className="text-white">{selectedCity.state}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">Population:</span>
                    <span className="text-white">{formatNumber(selectedCity.population_2020)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">CO2 Emissions:</span>
                    <span className="text-red-400 font-medium">{formatNumber(selectedCity.co2)} tons</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">GDP (2020):</span>
                    <span className="text-green-400">${selectedCity.gdp_2020.toFixed(1)}B</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">Urban Area:</span>
                    <span className="text-white">{selectedCity.urban_area_km2.toFixed(1)} km²</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">Road Length:</span>
                    <span className="text-white">{formatNumber(selectedCity.road_length_km)} km</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">State Population:</span>
                    <span className="text-white">{formatNumber(selectedCity.population_state)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Hover over a city on the map to see detailed information</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
