
import L from 'leaflet';

export const createMarkerIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-4 h-4 rounded-full ${isSelected ? 'bg-green-500' : 'bg-red-500'} border-2 border-white"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export const createNeedHelpUserMarkerIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-4 h-4 rounded-full ${isSelected ? 'bg-green-500' : 'bg-yellow-400'} border-2 border-white"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export const userMarkerIcon = L.divIcon({
  className: 'user-marker relative',
  html: `
    <div class="relative w-4 h-4">
      <div class="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-pulse" style="animation: pulse 2s infinite;"></div>
      <div class="relative w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
    </div>
    <style>
      @keyframes pulse {
        0% {
          transform: scale(1.5);
          opacity: 0.75;
        }
        50% {
          transform: scale(2);
          opacity: 0;
        }
        100% {
          transform: scale(1.5);
          opacity: 0.75;
        }
      }
      .animate-pulse {
        animation-timing-function: ease-in-out;
      }
    </style>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Fix for default Leaflet marker icons
export const initializeDefaultIcon = () => {
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  L.Marker.prototype.options.icon = defaultIcon;
};
