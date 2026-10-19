'use client'

import { useEffect, useState } from "react";
import { csvParse } from "d3-dsv";
import dynamic from 'next/dynamic';
import { ui } from '@/data/content';

// Dynamically import the map component with SSR disabled
const CO2Map = dynamic(() => import('./CO2Map'), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-lg bg-gray-700 flex items-center justify-center">
      <div className="text-white">{ui.work.loadingMap}</div>
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
      <section id="work" className="section-backdrop section-backdrop-900 w-full min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">{ui.work.loadingDashboard}</div>
      </section>
    );
  }

  return (
    <section id="work" className="section-backdrop section-backdrop-900 w-full min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        <div className="mb-8" data-river-avoid>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-none mb-8">
          {ui.work.heading}
          </h1>
          <p className="text-2xl md:text-3xl font-light text-white mb-3">{ui.work.intro}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">{ui.work.cards.totalCities}</h3>
            <p className="text-2xl font-bold text-white">{cityData.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">{ui.work.cards.totalCo2}</h3>
            <p className="text-2xl font-bold text-red-400">{formatNumber(totalCO2)} {ui.work.units.tonsPerYear}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">{ui.work.cards.perCapitaCo2}</h3>
            <p className="text-2xl font-bold text-orange-400">{perCapitaCO2.toFixed(2)} {ui.work.units.tonsPerPersonPerYear}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">{ui.work.cards.totalPopulation}</h3>
            <p className="text-2xl font-bold text-blue-400">{formatNumber(totalPopulation)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white text-lg font-semibold mb-4">{ui.work.mapTitle}</h3>
              <CO2Map 
                cityData={cityData}
                onCityHover={setSelectedCity}
              />
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-gray-300">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>{ui.work.legend.title}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>{ui.work.legend.low}</span>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>{ui.work.legend.medium}</span>
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span>{ui.work.legend.high}</span>
                  </div>
                </div>
                <div>
                  <span>{ui.work.legend.size}</span>
                </div>
              </div>
            </div>
          </div>

          {/* City Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-fit">
              <h3 className="text-white text-lg font-semibold mb-4">
                {selectedCity ? ui.work.panel.emissionDetails : ui.work.panel.cityInformation}
              </h3>
              {selectedCity ? (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">{ui.work.fields.city}</span>
                    <span className="text-white font-medium">{selectedCity.city}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">{ui.work.fields.state}</span>
                    <span className="text-white">{selectedCity.state}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">{ui.work.fields.population}</span>
                    <span className="text-white">{formatNumber(selectedCity.population_2020)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">{ui.work.fields.co2}</span>
                    <span className="text-red-400 font-medium">{formatNumber(selectedCity.co2)} {ui.work.units.tonsPerYear}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">{ui.work.fields.perCapita}</span>
                    <span className="text-orange-400 font-medium">{(selectedCity.co2 / selectedCity.population_2020).toFixed(2)} {ui.work.units.tonsPerPersonPerYear}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">{ui.work.fields.gdp}</span>
                    <span className="text-green-400">${selectedCity.gdp_2020.toFixed(1)}B</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">{ui.work.fields.urbanArea}</span>
                    <span className="text-white">{selectedCity.urban_area_km2.toFixed(1)} km²</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">{ui.work.fields.roadLength}</span>
                    <span className="text-white">{formatNumber(selectedCity.road_length_km)} km</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-400">{ui.work.fields.statePopulation}</span>
                    <span className="text-white">{formatNumber(selectedCity.population_state)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">{ui.work.panel.hoverHint}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
