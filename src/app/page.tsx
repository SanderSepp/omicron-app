// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import dynamic from 'next/dynamic';
import {MapPoint} from "@/lib/types";
import {useEffect, useState} from "react";
import Sidebar from "@/components/Sidebar";
import PointCard from "@/app/components/PointCard";
import PointForm from "./components/PointForm";
import Guidance from "@/app/components/guidance";
import {useAppState} from "@/app/AppContext";
import ProfileGuidance from "@/app/components/profile-guidance";
import {useValenciaResourceMapPoints} from "@/hooks/useValenciaResourcePointsDuringFlooding";

const CrisisMap = dynamic(() => import("@/app/components/CrisisMap"), {
  ssr: false,
});

const mockuserloclat = process.env.NEXT_PUBLIC_MOCK_USER_LOC_LAT;
const mockuserloclon = process.env.NEXT_PUBLIC_MOCK_USER_LOC_LON;

export default function MapPage() {
  const [points, setPoints] = useState<MapPoint[]>();
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [userLocation, setUserLocation] = useState<MapPoint | null>(null);
  const [newPointCoords, setNewPointCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [loading, setLoading] = useState(true);
  const [showWater, setShowWater] = useState(true);
  const [showShelter, setShowShelter] = useState(true);
  const [showSupermarket, setShowSupermarket] = useState(true);
  const [showPharmacy, setShowPharmacy] = useState(true);
  const [currentWeather, setCurrentWeather] = useState(true);
  const valenciaResourcePoints = useValenciaResourceMapPoints();

  const { event, setEvent } = useAppState();

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            id: "userLocation", // Dummy ID, replace with actual logic
            latitude: mockuserloclat ? Number(mockuserloclat) : position.coords.latitude,
            longitude: mockuserloclon ? Number(mockuserloclon) : position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (event === 'calm') {
      setShowWater(true);
      setShowShelter(true);
      setShowSupermarket(true);
      setShowPharmacy(true);
      setCurrentWeather("Sunny")
    }
    if (event === 'potentialFlooding') {
      setShowWater(true);
      setShowShelter(false);
      setShowSupermarket(true);
      setShowPharmacy(true);
      setCurrentWeather("Potential flooding in 24h")
    }
    if (event === 'flood') {
      setShowWater(false);
      setShowShelter(true);
      setShowSupermarket(false);
      setShowPharmacy(false);
      setCurrentWeather("Flooding")
    }
  }, [event]);

  useEffect(() => {
    if (userLocation) {
      fetchResources()
    }
  }, [userLocation, showSupermarket, showWater, showPharmacy, showShelter]);

  const fetchResources = async () => {
    setLoading(true);

    let filterOptions = '';
    if (showWater) filterOptions += '&water=true';
    if (showShelter) filterOptions += '&shelter=true';
    if (showSupermarket) filterOptions += '&supermarket=true';
    if (showPharmacy) filterOptions += '&pharmacy=true';

    try {
      const queryRes = await fetch(`/api/map?lat=${userLocation?.latitude}&lon=${userLocation?.longitude}&radius=${5000}${filterOptions}`, {
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


      if (event === 'flood') {
        setPoints(valenciaResourcePoints)
        setLoading(false);
        return;
      }
      setPoints(list)
    } catch (error) {
      console.error('Error fetching survival data:', error);
      setPoints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPoint = (point: MapPoint | null) => {
    setSelectedPoint(point);
    setNewPointCoords(null);
  };

  const handleAddPoint = (lat: number, lng: number) => {
    setNewPointCoords({ lat, lng });
    setSelectedPoint(null);
  };

  const handleSavePoint = (point: MapPoint) => {
    setPoints(prev => [...prev, point]);
    setNewPointCoords(null);
  };

  const [profile, setProfile] = useState<any | null>(() => {
    try {
      const storedProfiles = localStorage.getItem("selectedProfile");
      return storedProfiles ? JSON.parse(storedProfiles) : null;
    } catch {
      return [];
    }
  });


  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      console.log("Storage event: ", e);
      if (e.key === "selectedProfile") setProfile(JSON.parse(e.newValue || "[]"));
      if (e.key === "event") setEvent(e.newValue || "");
    };
    window.addEventListener("storage", onStorage);

    // Handler for custom event (same-tab updates)
    const onCustom = (e: Event) => {
      console.log("Custom event: ", e);
      setProfile(JSON.parse(localStorage.getItem("selectedProfile") || "[]"));
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

  function menuSetWater() {
    setShowWater(true)
    setShowShelter(false)
    setShowPharmacy(false)
    setShowSupermarket(false)
  }

  function menuSetShelter() {
    setShowWater(false)
    setShowShelter(true)
    setShowPharmacy(false)
    setShowSupermarket(false)
  }

  function menuSetFood() {
    setShowWater(false)
    setShowShelter(false)
    setShowPharmacy(false)
    setShowSupermarket(true)
  }

  function menuSetPharmacy() {
    setShowWater(false)
    setShowShelter(false)
    setShowPharmacy(true)
    setShowSupermarket(false)
  }

  function menuSetAll() {
    setShowWater(true)
    setShowShelter(true)
    setShowPharmacy(true)
    setShowSupermarket(true)
  }

  return (
    <div className="">
      <div className="flex bg-gray-100 h-[600px]">
        <div className="p-4 flex flex-col gap-1">
          <div className="flex flex-col bg-white rounded-lg shadow-md border">
            <div className="p-4">
              <h2 className="text-xl font-bold bord">Current weather: {currentWeather}</h2>
            </div>
          </div>
          <Sidebar
              points={points}
            selectedPoint={selectedPoint}
            onSelectPoint={handleSelectPoint}
            userLocation={userLocation}
            user={null}
            onMenuWater={() => menuSetWater()}
            onMenuShelter={() => menuSetShelter()}
            onMenuSupermarket={() => menuSetFood()}
            onMenuPharmacy={() => menuSetPharmacy()}
            onMenuAll={() => menuSetAll()}
            showWater={showWater}
            showShelter={showShelter}
            showSupermarket={showSupermarket}
            showPharmacy={showPharmacy}
          />
        </div>

        <div className="p-4 grow">
          <div className="relative h-full rounded-lg overflow-hidden">
            <CrisisMap
              event={event}
              points={points}
              selectedPoint={selectedPoint}
              onSelectPoint={handleSelectPoint}
              onAddPoint={handleAddPoint}
              isAdmin={false}
            />

            {(selectedPoint || newPointCoords) && (
              <div className="absolute bottom-4 right-4 w-full max-w-md">
                {selectedPoint && !newPointCoords && (
                  <PointCard
                    point={selectedPoint}
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

      </div>

      <div className="p-4">
        <Guidance guidanceType={event} />
        <div className="grid grid-cols-2 gap-2 ">
          <div>
            <ProfileGuidance profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}
