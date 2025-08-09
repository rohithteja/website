'use client'

import { useEffect, useState } from "react";
import { csvParse } from "d3-dsv";
import dynamic from 'next/dynamic';

// Dynamically import the map component with SSR disabled
const CO2Map = dynamic(() => import('./CO2Map'), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-lg bg-gray-700 flex items-center justify-center">
      <div className="text-white">Loading map...</div>
    </div>
  )
});

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const totalCO2 = cityData.reduce((sum, city) => sum + city.co2, 0);
  const totalPopulation = cityData.reduce((sum, city) => sum + city.population_2020, 0);
  const perCapitaCO2 = totalPopulation > 0 ? totalCO2 / totalPopulation : 0;

  if (loading) {
    return (
      <section id="work" className="bg-gray-900 w-full min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </section>
    );
  }

  return (
    <section id="work" className="bg-gray-900 w-full min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        <div className="mb-8">
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-light text-white leading-none mb-8">
          my work
          </h1>
          <h2 className="text-4xl font-light text-white mb-4">i estimate CO₂ emissions</h2>
          <h2 className="text-4xl font-light text-white mb-4">i build interpretable ML models</h2>
          <h2 className="text-4xl font-light text-white mb-4">i craft interactive visualizations</h2>
          <h2 className="text-4xl font-light text-white mb-4">simply put, i reshape complexity into clarity</h2>
            <div className="w-full h-px bg-gray-700 my-6" />
          <p className="text-5xl font-light text-white mb-4">check this dashboard i made:</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Total Cities</h3>
            <p className="text-2xl font-bold text-white">{cityData.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Total CO₂ Emissions</h3>
            <p className="text-2xl font-bold text-red-400">{formatNumber(totalCO2)} tons/year</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Per Capita CO₂ Emissions</h3>
            <p className="text-2xl font-bold text-orange-400">{perCapitaCO2.toFixed(2)} tons/person/year</p>
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
              <h3 className="text-white text-lg font-semibold mb-4">Interactive Map</h3>
              <CO2Map 
                cityData={cityData}
                onCityHover={setSelectedCity}
              />
              
              {/* Legend */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                <div className="flex items-center space-x-4">
                  <span>CO₂ Emissions:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Low</span>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Medium</span>
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span>High</span>
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
                {selectedCity ? `Emission Details` : 'City Information'}
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
                    <span className="text-gray-400">CO₂ Emissions:</span>
                    <span className="text-red-400 font-medium">{formatNumber(selectedCity.co2)} tons/year</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">Per Capita CO₂:</span>
                    <span className="text-orange-400 font-medium">{(selectedCity.co2 / selectedCity.population_2020).toFixed(2)} tons/person/year</span>
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
