'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para os ícones do Leaflet no Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícones customizados
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const userLocationIcon = createCustomIcon('#3b82f6'); // Azul
const alertIcon = createCustomIcon('#ef4444'); // Vermelho
const cameraIcon = createCustomIcon('#06b6d4'); // Ciano

// Componente para recentralizar o mapa
function RecenterButton({ position }: { position: [number, number] }) {
  const map = useMap();

  const handleRecenter = () => {
    map.setView(position, 13);
  };

  return (
    <button
      onClick={handleRecenter}
      className="absolute bottom-4 right-4 z-[1000] bg-zinc-900 hover:bg-zinc-800 text-cyan-400 p-3 rounded-lg shadow-lg border border-zinc-700 transition-colors"
      title="Recentralizar mapa"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>
  );
}

// Dados mockados de alertas e câmeras em Recife
const mockAlerts = [
  { id: 1, name: 'Crítico - Ibura', lat: -8.1189, lng: -34.9344 },
  { id: 2, name: 'Crítico - Recife Antigo', lat: -8.0631, lng: -34.8711 },
  { id: 3, name: 'Crítico - Imbiribeira', lat: -8.1289, lng: -34.9089 },
  { id: 4, name: 'Crítico - Santo Antônio', lat: -8.0578, lng: -34.8811 },
  { id: 5, name: 'Crítico - Derby', lat: -8.0489, lng: -34.8944 },
];

const mockCameras = [
  { id: 1, name: 'Câmera - Boa Viagem', lat: -8.1289, lng: -34.8944 },
  { id: 2, name: 'Câmera - Pina', lat: -8.0889, lng: -34.8789 },
  { id: 3, name: 'Câmera - Casa Amarela', lat: -8.0189, lng: -34.9189 },
  { id: 4, name: 'Câmera - Madalena', lat: -8.0589, lng: -34.9089 },
  { id: 5, name: 'Câmera - Várzea', lat: -8.0389, lng: -34.9589 },
];

export default function MapComponent() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Localização padrão (Recife)
  const defaultLocation: [number, number] = [-8.0476, -34.8770];

  useEffect(() => {
    setIsClient(true);

    // Obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setUserLocation(defaultLocation);
        }
      );
    } else {
      setUserLocation(defaultLocation);
    }
  }, []);

  if (!isClient || !userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 rounded-lg">
        <div className="text-zinc-400">Carregando mapa...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      <style jsx global>{`
        .leaflet-container {
          background: #1e293b !important;
        }
        
        /* Controles de zoom */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3) !important;
        }
        .leaflet-control-zoom a {
          background-color: #18181b !important;
          color: #22d3ee !important;
          border: 1px solid #3f3f46 !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 20px !important;
          transition: all 0.2s !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #27272a !important;
          color: #06b6d4 !important;
          border-color: #52525b !important;
        }
        .leaflet-control-zoom-in {
          border-radius: 8px 8px 0 0 !important;
        }
        .leaflet-control-zoom-out {
          border-radius: 0 0 8px 8px !important;
        }
        
        /* Atribuição */
        .leaflet-control-attribution {
          background: rgba(24, 24, 27, 0.9) !important;
          color: #71717a !important;
          border: 1px solid #3f3f46 !important;
          border-radius: 6px !important;
          padding: 4px 8px !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: #60a5fa !important;
        }
        
        /* Popups */
        .leaflet-popup-content-wrapper {
          background: #18181b !important;
          color: #f4f4f5 !important;
          border: 1px solid #3b82f6 !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
        }
        .leaflet-popup-tip {
          background: #18181b !important;
          border: 1px solid #3b82f6 !important;
        }
        .leaflet-popup-close-button {
          color: #f4f4f5 !important;
          font-size: 20px !important;
          padding: 4px 8px !important;
        }
        .leaflet-popup-close-button:hover {
          color: #22d3ee !important;
        }
      `}</style>

      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* Usando tile do CartoDB Dark Matter - mais legível */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Marcador da localização do usuário */}
        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup>
            <div className="text-sm font-semibold text-white">Sua localização</div>
          </Popup>
        </Marker>

        {/* Marcadores de alertas */}
        {mockAlerts.map((alert) => (
          <Marker key={alert.id} position={[alert.lat, alert.lng]} icon={alertIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold text-red-400">{alert.name}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Marcadores de câmeras */}
        {mockCameras.map((camera) => (
          <Marker key={camera.id} position={[camera.lat, camera.lng]} icon={cameraIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold text-cyan-400">{camera.name}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        <RecenterButton position={userLocation} />
      </MapContainer>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-blue-900/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-700">
        <h3 className="text-sm font-semibold text-white mb-3">Legenda</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
            <span className="text-xs text-white font-medium">Sua localização</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg"></div>
            <span className="text-xs text-white font-medium">Alertas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-white shadow-lg"></div>
            <span className="text-xs text-white font-medium">Câmeras</span>
          </div>
        </div>
      </div>
    </div>
  );
}
