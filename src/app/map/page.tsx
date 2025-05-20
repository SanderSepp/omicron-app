"use client";

import { samplePoints } from "@/lib/dummy-data";
import { getRouteInformation } from "@/lib/map-utils";
import { MapPoint, RouteInfo, User } from "@/lib/types";
import { useEffect, useState } from "react";
import PointCard from "@/app/map/components/PointCard";
import PointForm from "@/app/map/components/PointForm";
import CrisisMap from "@/app/map/components/CrisisMap";
import {users} from "@/lib/dummyData";
import Sidebar from "@/components/Sidebar";

export default function MapPage() {
  const [points, setPoints] = useState<MapPoint[]>(samplePoints);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [newPointCoords, setNewPointCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  }, []);

  // Get route info when point is selected
  useEffect(() => {
    if (selectedPoint && userLocation) {
      getRouteInformation(
        userLocation,
        { lat: selectedPoint.latitude, lng: selectedPoint.longitude }
      ).then(info => {
        setRouteInfo(info);
      });
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
    if (currentUser?.isAdmin) {
      setNewPointCoords({ lat, lng });
      setSelectedPoint(null);
    }
  };

  const handleSavePoint = (point: MapPoint) => {
    setPoints(prev => [...prev, point]);
    setNewPointCoords(null);
  };

  const handleUserChange = (isAdmin: boolean) => {
    if (currentUser) {
      // Log out
      setCurrentUser(null);
    } else {
      // Open auth modal
      setAuthModalOpen(true);
    }
  };

  const handleLogin = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setAuthModalOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/*<Toaster />*/}

      {/* Sidebar - 1/3 width on desktop, full width on mobile with toggle */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-4">
        <Sidebar
          points={points}
          selectedPoint={selectedPoint}
          onSelectPoint={handleSelectPoint}
          userLocation={userLocation}
          user={currentUser}
          onUserChange={handleUserChange}
        />
      </div>

      {/* Main content - 2/3 width on desktop, full width on mobile with toggle */}
      <div className="hidden md:block md:w-2/3 lg:w-3/4 p-4">
        <div className="relative h-full rounded-lg overflow-hidden">
          <CrisisMap
            points={points}
            selectedPoint={selectedPoint}
            onSelectPoint={handleSelectPoint}
            onAddPoint={handleAddPoint}
            isAdmin={currentUser?.isAdmin || false}
          />

          {/* Authentication Button - Mobile only */}
          <div className="absolute top-4 left-4 md:hidden">
            {/*<Button*/}
            {/*  variant="secondary"*/}
            {/*  size="sm"*/}
            {/*  onClick={() => handleUserChange(!currentUser?.isAdmin)}*/}
            {/*>*/}
            {/*  {currentUser ? (*/}
            {/*    <>*/}
            {/*      <LogOut className="h-4 w-4 mr-2" />*/}
            {/*      Logout*/}
            {/*    </>*/}
            {/*  ) : (*/}
            {/*    <>*/}
            {/*      <LogIn className="h-4 w-4 mr-2" />*/}
            {/*      Login*/}
            {/*    </>*/}
            {/*  )}*/}
            {/*</Button>*/}
          </div>

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

              {newPointCoords && currentUser?.isAdmin && (
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

      {/* Mobile Map View */}
      <div className="fixed inset-0 md:hidden">
        {selectedPoint || newPointCoords ? (
          <div className="absolute inset-x-0 bottom-0 z-10 p-4">
            {selectedPoint && !newPointCoords && (
              <PointCard
                point={selectedPoint}
                routeInfo={routeInfo}
                onGetDirections={handleGetDirections}
                onClose={() => setSelectedPoint(null)}
              />
            )}

            {newPointCoords && currentUser?.isAdmin && (
              <PointForm
                coordinates={newPointCoords}
                onSave={handleSavePoint}
                onCancel={() => setNewPointCoords(null)}
              />
            )}
          </div>
        ) : null}
      </div>

      {/*/!* Auth Modal *!/*/}
      {/*<AuthModal*/}
      {/*  open={authModalOpen}*/}
      {/*  onClose={() => setAuthModalOpen(false)}*/}
      {/*  onLogin={handleLogin}*/}
      {/*/>*/}
    </div>
  );
}
