import React, {useEffect, useRef, useState} from 'react';
import {MapPoint, RouteInfo} from '@/lib/types';
import {getRouteInformation} from '@/lib/map-utils';
import {MapContainer, Marker, Polygon, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import * as ReactDOMServer from 'react-dom/server';

// Import our new components
import MapInteractions from './map/MapInteractions';
import ChangeMapView from './map/ChangeMapView';
import RouteInfoDisplay from './map/RouteInfo';
import MapControls from './map/MapControls';
import {createMarkerIcon, initializeDefaultIcon, userMarkerIcon} from './map/MarkerIcons';

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useFloodedCoords} from "@/hooks/useFloodedCoordinates";
import {FaBookMedical, FaTint} from "react-icons/fa";
import {FaCartShopping} from "react-icons/fa6";
import {IoTriangle} from "react-icons/io5";

interface MapProps {
    points: MapPoint[],
    selectedPoint: MapPoint | null,
    onSelectPoint: (point: MapPoint | null) => void,
    onAddPoint?: (lat: number, lng: number) => void,
    isAdmin: boolean,
    event?: any
}

// Initialize default Leaflet icon
initializeDefaultIcon();

const mockuserloclat = process.env.NEXT_PUBLIC_MOCK_USER_LOC_LAT;
const mockuserloclon = process.env.NEXT_PUBLIC_MOCK_USER_LOC_LON;

const CrisisMap: React.FC<MapProps> = ({
                                           points,
                                           selectedPoint,
                                           onSelectPoint,
                                           onAddPoint,
                                           isAdmin,
                                           event
                                       }) => {
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default: NYC
    const mapRef = useRef<L.Map | null>(null);
    const routingControlRef = useRef<any>(null);
    // Tooltip state: { point, position: { x, y } }
    const [tooltip, setTooltip] = useState<{ point: MapPoint; position: { x: number; y: number } } | null>(null);
    const floodedAreaCoords = useFloodedCoords();

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
                    if (mockuserloclat && mockuserloclon) {
                        setUserLocation([
                            Number(mockuserloclat),
                            Number(mockuserloclon)
                        ]);
                    } else {
                        setUserLocation(userPos);
                    }
                    setMapCenter(userPos);
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

    function jsonToHtml(obj: { [s: string]: unknown; } | ArrayLike<unknown>) {
        let html = '<ul>';
        for (const [key, value] of Object.entries(obj)) {
            html += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        html += '</ul>';
        return html;
    }

    function getCustomIcon(point: MapPoint) {
        let iconEl = null;
        // @ts-ignore
        if (point.tags && point.tags["amenity"] === "drinking_water") {
            iconEl = <FaTint color="#0074D9" size={24}/>;
            // @ts-ignore
        } else if (point.tags && point.tags["amenity"] === "pharmacy") {
            iconEl = <FaBookMedical color="#FF0000" size={24}/>;
            // @ts-ignore
        } else if (point.tags && point.tags["shelter"] === "yes") {
            iconEl = <IoTriangle color="#221C51" size={24}/>;
            // @ts-ignore
        } else if (point.tags && point.tags["shop"] === "supermarket") {
            iconEl = <FaCartShopping color="#27ae60" size={24}/>;
        }

        if (iconEl) {
            return L.divIcon({
                className: 'custom-div-icon',
                html: ReactDOMServer.renderToString(iconEl),
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30],
            });
        }
        // fallback to default
        return createMarkerIcon(point.id === selectedPoint?.id);
    }

    return (
        <div className="relative w-full h-full">
            <TooltipProvider delayDuration={0}>
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{height: "500px", width: "100%"}}
                    className="rounded-lg shadow-md z-0"
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {event === "flood" && floodedAreaCoords && floodedAreaCoords.map((poly, idx) => (
                        <Polygon
                            key={idx}
                            positions={poly}
                            pathOptions={{color: 'blue', fillOpacity: 0.3}}
                        />
                    ))}

                    {userLocation && (
                        <Marker position={userLocation} icon={userMarkerIcon}>
                            <Popup>Your current location</Popup>
                        </Marker>
                    )}

                    {points.map((point) => {
                        const icon = getCustomIcon(point); // This picks a custom icon if matched

                        return (
                            <Marker
                                key={point.id}
                                position={[point.latitude, point.longitude]}
                                icon={icon}
                                eventHandlers={{
                                    click: () => {
                                        handleMarkerClick(point);
                                    }
                                }}
                            />
                        );
                    })}
                    {/*{points.map((point) => {*/}
                    {/*    // const isDrinkingWater = point.tags["amenity"] === "drinking_water";*/}
                    {/*    // const isBus = point.tags["bus"] === "yes";*/}
                    {/*    // console.log("isDrinkingWater:", isDrinkingWater);*/}
                    {/*    // console.log("isBus:", isBus);*/}
                    {/*    return (*/}
                    {/*        <Marker*/}
                    {/*            key={point.id}*/}
                    {/*            position={[point.latitude, point.longitude]}*/}
                    {/*            icon={createMarkerIcon(point.id === selectedPoint?.id)}*/}
                    {/*            eventHandlers={{*/}
                    {/*                click: () => {*/}
                    {/*                    handleMarkerClick(point);*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*    );*/}
                    {/*})}*/}

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
                                    <div className="text-sm text-gray-500">
                                        {tooltip.point.tags &&
                                            <div dangerouslySetInnerHTML={{__html: jsonToHtml(tooltip.point.tags)}}/>}
                                    </div>
                                    <button
                                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        onClick={() => {
                                            onSelectPoint(tooltip.point);
                                            setTooltip(null);
                                        }}
                                    >
                                        Get Directions
                                    </button>
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

export default CrisisMap;
