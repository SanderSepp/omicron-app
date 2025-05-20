"use client";
// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { MapPoint, RouteInfo, User } from '@/lib/types';
import { samplePoints, users } from '@/lib/dummyData';
import { getRouteInformation } from '@/lib/mapUtils';
import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';
import PointCard from '@/components/PointCard';
import PointForm from '@/components/PointForm';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { LogIn, LogOut } from 'lucide-react';

const Home = () => {
  const [points, setPoints] = useState<MapPoint[]>(samplePoints);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [newPointCoords, setNewPointCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Get user location
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
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
    setNewPointCoords(null);
  };

  const handleGetDirections = () => {
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

  const handleUserChange = () => {
    if (currentUser) {
      setCurrentUser(null);
    } else {
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
        <Toaster />
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
        <div className="hidden md:block md:w-2/3 lg:w-3/4 p-4">
          <div className="relative h-full rounded-lg overflow-hidden">
            <Map
                points={points}
                selectedPoint={selectedPoint}
                onSelectPoint={handleSelectPoint}
                onAddPoint={handleAddPoint}
                isAdmin={currentUser?.isAdmin || false}
            />
            <div className="absolute top-4 left-4 md:hidden">
              <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleUserChange}
              >
                {currentUser ? (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </>
                ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </>
                )}
              </Button>
            </div>
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
        <AuthModal
            open={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onLogin={handleLogin}
        />
      </div>
  );
};

export default Home;