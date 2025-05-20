"use client";

import { samplePoints } from "@/lib/dummy-data";
import { MapPoint, RouteInfo } from "@/lib/types";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import CrisisMap from "@/app/components/CrisisMap";
import PointCard from "@/app/components/PointCard";
import PointForm from "./components/PointForm";
import Guidance from "@/app/components/guidance";

export default function MapPage() {
  const [points, setPoints] = useState<MapPoint[]>(samplePoints);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [userLocation, setUserLocation] = useState<MapPoint | null>(null);
  const [newPointCoords, setNewPointCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            id: "userLocation", // Dummy ID, replace with actual logic
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchResources()
    }
  }, [userLocation]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const queryRes = await fetch(`/api/map?lat=${userLocation?.latitude}&lon=${userLocation?.longitude}&radius=${1000}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await queryRes.json();

      const list = data.map((place: any) => {
        return {
          id: place.name + place.lat + place.lon,
          name: place.name,
          latitude: place.lat,
          longitude: place.lon,
          tags: place.tags
        }
      });

      setPoints(list)
    } catch (error) {
      console.error('Error fetching survival data:', error);
    } finally {
      setLoading(false);
    }
  };


  // Get route info when point is selected
  useEffect(() => {
    if (selectedPoint && userLocation) {
      // getRouteInformation(
      //   userLocation,
      //   { lat: selectedPoint.latitude, lng: selectedPoint.longitude }
      // ).then(info => {
      //   setRouteInfo(info);
      // });
    } else {
      setRouteInfo(null);
    }
  }, [selectedPoint, userLocation]);

  const handleSelectPoint = (point: MapPoint | null) => {
    setSelectedPoint(point);
    // Close add point form if open
    setNewPointCoords(null);
  };

  const handleGetDirections = () => {
    // In a real app, this might open native maps or provide more detailed instructions
    if (selectedPoint) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.latitude},${selectedPoint.longitude}`,
        '_blank'
      );
    }
  };

  const handleAddPoint = (lat: number, lng: number) => {
    setNewPointCoords({ lat, lng });
    setSelectedPoint(null);
  };

  const handleSavePoint = (point: MapPoint) => {
    setPoints(prev => [...prev, point]);
    setNewPointCoords(null);
  };

  const [profiles, setProfiles] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("selectedProfile") || "[]");
    } catch {
      return [];
    }
  });
  const [event, setEvent] = useState<string>(() => {
    try {
      return localStorage.getItem("event") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    // Handler for native storage events (cross-tab)
    const onStorage = (e: StorageEvent) => {
      console.log("Storage event: ", e);
      if (e.key === "selectedProfile") setProfiles(JSON.parse(e.newValue || "[]"));
      if (e.key === "event") setEvent(e.newValue || "");
    };
    window.addEventListener("storage", onStorage);

    // Handler for custom event (same-tab updates)
    const onCustom = (e: Event) => {
      console.log("Custom event: ", e);
      setProfiles(JSON.parse(localStorage.getItem("selectedProfile") || "[]"));
      setEvent(localStorage.getItem("event") || "");
    };
    window.addEventListener("localStorageChanged", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("localStorageChanged", onCustom);
    };
  }, []);

  if (loading) {
    return <div
      style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <p>Loading...</p></div>
  }


  return (
    <div className="flex-row md:flex h-screen bg-gray-100">
      {/* Sidebar - 1/3 width on desktop, full width on mobile with toggle */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-4">
        <Sidebar
          points={points}
          selectedPoint={selectedPoint}
          onSelectPoint={handleSelectPoint}
          userLocation={userLocation}
        />
      </div>

      {/* Main content - 2/3 width on desktop, full width on mobile with toggle */}
      <div className="md:block md:w-1/3 lg:w-2/4 p-4">
        <div className="relative h-full rounded-lg overflow-hidden">
          <CrisisMap
            points={points}
            selectedPoint={selectedPoint}
            onSelectPoint={handleSelectPoint}
            onAddPoint={handleAddPoint}
            isAdmin={false}
          />

          {/* Point Details or Add Form */}
          {(selectedPoint || newPointCoords) && (
            <div className="absolute bottom-4 right-4 w-full max-w-md">
              {selectedPoint && !newPointCoords && (
                <PointCard
                  point={selectedPoint}
                  routeInfo={routeInfo}
                  onGetDirections={handleGetDirections}
                  onClose={() => setSelectedPoint(null)}
                />
              )}

              {newPointCoords && (
                <PointForm
                  coordinates={newPointCoords}
                  onSave={handleSavePoint}
                  onCancel={() => setNewPointCoords(null)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="md:block md:w-1/3 lg:w-1/4 p-4">
        <Guidance guidanceType={event} />
      </div>

      <div className="p-6">
        <div>
          <div
            className="fixed bottom-2 right-2 bg-white/90 p-2 rounded shadow-lg text-xs w-64 max-h-64 overflow-auto z-50">
            <strong className="block mb-1">⚙️ Storage Debug</strong>
            <div>
              <em>profiles:</em>
              <pre className="whitespace-pre-wrap">{JSON.stringify(profiles, null, 2)}</pre>
            </div>
            <div>
              <em>events:</em>
              <pre className="whitespace-pre-wrap">{event}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
