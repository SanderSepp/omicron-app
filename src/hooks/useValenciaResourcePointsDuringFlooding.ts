// hooks/useValenciaFloodPolygons.ts
import {useEffect, useState} from "react";
import {MapPoint} from "@/lib/types";

// Type for a single [lat, lng] tuple
type LatLngTuple = [number, number];

// ResourcePoint represents a single point with a name and coordinates
export interface ResourcePoint {
    name: string;
    coords: LatLngTuple;
}

// Helper function to parse WKT POINT string into a [lat, lng] tuple
function parseWktPoint(wkt: string): LatLngTuple {
    // Match the coordinates inside the parentheses of POINT WKT
    // Example: POINT (123.456 39.123)
    const match = wkt.match(/POINT\s*\(\s*([^\)]+?)\s*\)/i);
    if (!match) {
        throw new Error("Invalid WKT POINT format");
    }
    // The match[1] should be "lng lat" (note: WKT is usually lng lat)
    const [lngStr, latStr] = match[1].trim().split(/\s+/);
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinate numbers in WKT POINT");
    }
    return [lat, lng];
}

// Hook to fetch and parse resource points from CSV as ResourcePoint[]
export function useValenciaResourcePointsDuringFlooding(): ResourcePoint[] | null {
    const [points, setPoints] = useState<ResourcePoint[] | null>(null);

    useEffect(() => {
        fetch("/water_shelter_food.csv")
            .then(res => res.text())
            .then((csv) => {
                const lines = csv.split('\n').slice(1); // Skip header
                const result: ResourcePoint[] = [];

                // Regex to match a line with optional quotes around fields, capturing WKT and name
                const lineRegex = /^\s*"?([^"]+?)"?\s*,\s*"?([^"]+?)"?\s*$/;

                for (const line of lines) {
                    if (!line.trim()) continue;

                    const match = lineRegex.exec(line);
                    if (!match || match.length < 3) {
                        // Skip malformed lines
                        continue;
                    }

                    const wkt = match[1];
                    const name = match[2];

                    try {
                        // Only parse and add if WKT is a POINT
                        if (/^POINT\s*\(/i.test(wkt)) {
                            // Parse WKT POINT string to coordinates
                            const coords = parseWktPoint(wkt);
                            result.push({ name, coords });
                        }
                    } catch (error) {
                        // Skip lines with invalid WKT format or coordinates
                        // Optionally, could log error here if needed
                    }
                }
                setPoints(result);
            })
            .catch(() => {
                // In case of fetch error, set points to null or handle accordingly
                setPoints(null);
            });
    }, []);

    return points;
}


export function useValenciaResourceMapPoints(): MapPoint[] | null {
    const resourcePoints = useValenciaResourcePointsDuringFlooding();

    if (!resourcePoints) {
        return null;
    }

    return resourcePoints.map((point, index) => {
        let type: MapPoint["type"] = "shelter"; // default fallback type
        if (point.name.includes("Drinking water")) {
            type = "drinking_water";
        } else if (point.name.includes("Food supply")) {
            type = "food_supply";
        } else if (point.name.includes("Shelter")) {
            type = "shelter";
        }

        return {
            id: `resource-${index}`,
            latitude: point.coords[0],
            longitude: point.coords[1],
            name: point.name,
            type,
        };
    });
}