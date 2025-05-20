import React, {useState, useEffect, useRef} from 'react';
import {MapPoint, RouteInfo} from '@/lib/types';
import {getRouteInformation} from '@/lib/map-utils';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Import our new components

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {createNeedHelpUserMarkerIcon, initializeDefaultIcon, userMarkerIcon} from "@/app/components/map/MarkerIcons";
import MapControls from "@/app/components/map/MapControls";
import RouteInfoDisplay from '@/app/components/map/RouteInfo';
import MapInteractions from "@/app/components/map/MapInteractions";
import ChangeMapView from '@/app/components/map/ChangeMapView';

interface MapProps {
    points: MapPoint[];
    selectedPoint: MapPoint | null;
    onSelectPoint: (point: MapPoint | null) => void;
    onAddPoint?: (lat: number, lng: number) => void;
    isAdmin: boolean;
}

// Initialize default Leaflet icon
initializeDefaultIcon();

const UsersMap: React.FC<MapProps> = ({
                                          points,
                                          selectedPoint,
                                          onSelectPoint,
                                          onAddPoint,
                                          isAdmin
                                      }) => {
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const routingControlRef = useRef<any>(null);
    // Tooltip state: { point, position: { x, y } }
    const [tooltip, setTooltip] = useState<{ point: MapPoint; position: { x: number; y: number } } | null>(null);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(userPos);
                },
                () => {
                    // Handle location error
                    // This is now handled in MapControls component
                }
            );
        }
    }, []);

    // Update route when selected point changes (draw route using Leaflet Routing Machine)
    useEffect(() => {
        if (!mapRef.current) return;
        // Remove previous routing control if exists
        if (routingControlRef.current) {
            routingControlRef.current.remove();
            routingControlRef.current = null;
        }
        if (selectedPoint && userLocation) {
            // Get route info (for display)
            getRouteInformation(
                {lat: userLocation[0], lng: userLocation[1]},
                {lat: selectedPoint.latitude, lng: selectedPoint.longitude}
            ).then(info => {
                setRouteInfo(info);
            });
            // Add routing control for walking
            // @ts-ignore
            const control = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation[0], userLocation[1]),
                    L.latLng(selectedPoint.latitude, selectedPoint.longitude)
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                fitSelectedRoutes: true,
                show: false,
                lineOptions: {
                    styles: [{color: "#3b82f6", weight: 5, opacity: 0.7}],
                    extendToWaypoints: false,
                    missingRouteTolerance: 0
                },
                router: L.Routing.osrmv1({
                    profile: "foot"
                })
            }).addTo(mapRef.current);
            routingControlRef.current = control;
        } else {
            setRouteInfo(null);
        }
        // Clean up on unmount
        return () => {
            if (routingControlRef.current) {
                routingControlRef.current.remove();
                routingControlRef.current = null;
            }
        };
    }, [selectedPoint, userLocation]);

    // Helper: handle marker click to show tooltip at marker's position
    const handleMarkerClick = (point: MapPoint) => {
        if (!mapRef.current) return;
        // Compute marker's screen position
        const latlng = L.latLng(point.latitude, point.longitude);
        const containerPoint = mapRef.current.latLngToContainerPoint(latlng);
        setTooltip({
            point,
            position: {x: containerPoint.x, y: containerPoint.y}
        });
    };

    // Close tooltip if user clicks elsewhere on the map
    useEffect(() => {
        if (!mapRef.current) return;
        const closeTooltip = () => setTooltip(null);
        // @ts-ignore
        mapRef.current.on('click', closeTooltip);

        return () => {
            // @ts-ignore
            mapRef.current && mapRef.current.off('click', closeTooltip);
        };
    }, [mapRef.current]);

    return (
        <div className="relative w-full h-full">
            <TooltipProvider delayDuration={0}>
                <MapContainer
                    zoom={13}
                    style={{height: "500px", width: "100%"}}
                    className="rounded-lg shadow-md z-0"
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {userLocation && (
                        <Marker position={userLocation} icon={userMarkerIcon}>
                            <Popup>Your current location</Popup>
                        </Marker>
                    )}

                    {points.map((point) => (
                        <Marker
                            key={point.id}
                            position={[point.latitude, point.longitude]}
                            icon={createNeedHelpUserMarkerIcon(point.id === selectedPoint?.id)}
                            eventHandlers={{
                                click: () => {
                                    handleMarkerClick(point);
                                }
                            }}
                        />
                    ))}

                    <MapInteractions onAddPoint={onAddPoint} isAdmin={isAdmin}/>
                    {userLocation && <ChangeMapView coords={userLocation}/>}
                </MapContainer>

                {/* Tooltip rendered absolutely over the map */}
                {tooltip && (
                    <div
                        style={{
                            position: "absolute",
                            left: tooltip.position.x,
                            top: tooltip.position.y,
                            zIndex: 1000
                        }}
                    >
                        <Tooltip open={true}>
                            <TooltipTrigger asChild>
                                <div/>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                                <div className="min-w-[180px] max-w-xs space-y-2">
                                    <div className="font-semibold">{tooltip.point.name}</div>
                                    <div className="text-sm text-gray-500">{tooltip.point.description}</div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}

                {/* Map Controls */}
                <MapControls
                    userLocation={userLocation}
                    isAdmin={isAdmin}
                    mapRef={mapRef}
                />

                {/* Route Information */}
                {routeInfo && selectedPoint && (
                    <RouteInfoDisplay
                        routeInfo={routeInfo}
                        selectedPoint={selectedPoint}
                        userLocation={userLocation}
                    />
                )}
            </TooltipProvider>
        </div>
    );
};

export default UsersMap;

function onAddPoint(lat: number, lng: number): void {
    throw new Error('Function not implemented.');
}

