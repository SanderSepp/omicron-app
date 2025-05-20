"use client";

import {MapPoint, User} from "@/lib/types";
import {useEffect, useState, useRef} from "react";
import UsersMap from "@/app/map/components/UsersMap";

// --- Begin: Helpers for generating random help requests ---
const HELP_TYPES = ["need water", "need medicine", "need food", "need shelter"];
const RANDOM_BOUNDS = {
    minLat: 59.44443460118304,
    maxLat: 59.429108564788244,
    minLng: 24.71198837557307,
    maxLng: 24.747693105869605,
};

function getRandomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function generateRandomHelpRequest(): MapPoint & { helpType: string; reportedAt: number } {
    const helpType = HELP_TYPES[Math.floor(Math.random() * HELP_TYPES.length)];
    const lat = getRandomInRange(RANDOM_BOUNDS.minLat, RANDOM_BOUNDS.maxLat);
    const lng = getRandomInRange(RANDOM_BOUNDS.minLng, RANDOM_BOUNDS.maxLng);
    const timestamp = Date.now();
    return {
        id: `help-${timestamp}-${Math.floor(Math.random() * 10000)}`,
        latitude: lat,
        longitude: lng,
        name: `User needs help`,
        description: helpType,
        helpType,
        reportedAt: timestamp,
    };
}

// --- End: Helpers ---

export default function MapPage() {
    const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // --- Begin: State for random help requests ---
    const [helpRequests, setHelpRequests] = useState<Array<MapPoint & { helpType: string; reportedAt: number }>>([]);
    const helpRequestTimeouts = useRef<{ [id: string]: NodeJS.Timeout }>({});
    // --- End: State for random help requests ---


    const handleSelectPoint = (point: MapPoint | null) => {
        setSelectedPoint(point);
    };

    const handleAddPoint = (lat: number, lng: number) => {
        if (currentUser?.isAdmin) {
            setSelectedPoint(null);
        }
    };

    // --- Begin: Add random help requests every 15 sec, remove after 5 sec ---
    // Add random help requests every 15 sec, remove after 5 sec
    useEffect(() => {
        let count = 0;
        const maxRequests = 8;
        const interval = setInterval(() => {
            if (count >= maxRequests) {
                clearInterval(interval);
                return;
            }
            const newRequest = generateRandomHelpRequest();
            setHelpRequests(prev => {
                // PREPEND new request, keep only the latest 8
                const updated = [newRequest, ...prev];
                return updated.slice(0, 8);
            });
            count++;
        }, 2000);

        return () => {
            clearInterval(interval);
            // Clear pending timeouts on unmount
            Object.values(helpRequestTimeouts.current).forEach(clearTimeout);
        };
    }, []);
    // --- End: Add random help requests ---

    const stored = localStorage.getItem("selectedProfile");
    console.log("stored:", stored);
    // --- Combine all points for map display ---
    const allPoints: MapPoint[] = [
        ...helpRequests.map(hr => ({
            ...hr,
            name: `Help request (${hr.helpType})`,
            description: `ID: ${hr.id}\nType: ${hr.helpType}\nReported: ${new Date(hr.reportedAt).toLocaleTimeString()}`
        })),
    ];

    return (
        <div className="flex-row md:flex h-screen bg-gray-100">
            {/* Main content */}
            <div className="md:block md:w-2/3 lg:w-full p-4">
                <div className="relative h-full rounded-lg overflow-hidden">
                    <UsersMap
                        points={allPoints}
                        selectedPoint={selectedPoint}
                        onSelectPoint={handleSelectPoint}
                        onAddPoint={handleAddPoint}
                        isAdmin={true}
                    />
                </div>
            </div>
        </div>
    );
}