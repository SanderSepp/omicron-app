// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, {useEffect, useRef, useState} from 'react';
import {MapPoint, RouteInfo} from '@/lib/types';
import {getRouteInformation} from '@/lib/map-utils';
import {MapContainer, Marker, Polygon, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import * as ReactDOMServer from 'react-dom/server';
import MapInteractions from './map/MapInteractions';
import ChangeMapView from './map/ChangeMapView';
import RouteInfoDisplay from './map/RouteInfo';
import MapControls from './map/MapControls';
import {createMarkerIcon, initializeDefaultIcon, userMarkerIcon} from './map/MarkerIcons';

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {FaBookMedical, FaTint} from "react-icons/fa";
import {FaCartShopping} from "react-icons/fa6";
import {IoTriangle} from "react-icons/io5";
import {useValenciaPotentialFloodPolygons} from "@/hooks/useValenciaPotentialFloodPolygons";
import {useValenciaFloodedPolygons} from "@/hooks/useValenciaFloodedPolygons";

interface MapProps {
    points: MapPoint[],
    selectedPoint: MapPoint | null,
    onSelectPoint: (point: MapPoint | null) => void,
    onAddPoint?: (lat: number, lng: number) => void,
    isAdmin: boolean,
    event?: any
}

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
    const [tooltip, setTooltip] = useState<{ point: MapPoint; position: { x: number; y: number } } | null>(null);
    const valenciaPotentialFloodPolygons = useValenciaPotentialFloodPolygons();
    const valenciaFloodedPolygons = useValenciaFloodedPolygons();

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
                }
            );
        }
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;
        if (routingControlRef.current) {
            routingControlRef.current.remove();
            routingControlRef.current = null;
        }
        if (selectedPoint && userLocation) {
            getRouteInformation(
                {lat: userLocation[0], lng: userLocation[1]},
                {lat: selectedPoint.latitude, lng: selectedPoint.longitude}
            ).then(info => {
                setRouteInfo(info);
            });
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
        mapRef.current.on('click', closeTooltip);
        return () => {
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
        if ((point.tags && point.tags["amenity"] === "drinking_water") || (point?.type === "drinking_water")) {
            iconEl = <FaTint color="#0074D9" size={24}/>;
        } else if ((point.tags && point.tags["amenity"] === "pharmacy") || (point?.type === "pharmacy")) {
            iconEl = <FaBookMedical color="#FF0000" size={24}/>;
        } else if ((point.tags && point.tags["shelter"] === "yes") || (point?.type === "shelter")) {
            iconEl = <IoTriangle color="#221C51" size={24}/>;
        } else if ((point.tags && point.tags["shop"] === "supermarket") || (point?.type === "food_supply")) {
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
                    style={{height: "100vh", width: "100%"}}
                    className="rounded-lg shadow-md z-0"
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {event === "flood" && valenciaFloodedPolygons?.map((poly, idx) => (
                        <Polygon
                            key={poly.name}
                            positions={poly.coords}
                            pathOptions={{color: "red", fillOpacity: 0.4}}
                        >
                            <Popup>{poly.name}</Popup>
                        </Polygon>
                    ))}

                    {event === "potentialFlooding" && valenciaPotentialFloodPolygons?.map((poly, idx) => (
                        <Polygon
                            key={poly.name}
                            positions={poly.coords}
                            pathOptions={{color: "orange", fillOpacity: 0.4}}
                        >
                            <Popup>{poly.name}</Popup>
                        </Polygon>
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
