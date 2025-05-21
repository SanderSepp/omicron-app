// hooks/useValenciaFloodPolygons.ts
import { useEffect, useState } from "react";

type LatLngTuple = [number, number];
interface CsvPolygon {
    name: string;
    coords: LatLngTuple[];
}

// Helper function to parse WKT polygon string into an array of [lat, lng] tuples
function parseWktPolygon(wkt: string): LatLngTuple[] {
    // Match the coordinates inside the double parentheses of POLYGON WKT
    const match = wkt.match(/POLYGON\s*\(\(\s*([^\)]+?)\s*\)\)/i);
    if (!match) {
        throw new Error("Invalid WKT format");
    }
    const coordsRaw = match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
    // Convert each coordinate pair from "lng lat" to [lat, lng]
    const coords: LatLngTuple[] = coordsRaw.map(pt => {
        const [lngStr, latStr] = pt.split(/\s+/);
        const lat = Number(latStr);
        const lng = Number(lngStr);
        if (isNaN(lat) || isNaN(lng)) {
            throw new Error("Invalid coordinate numbers in WKT");
        }
        return [lat, lng];
    });
    return coords;
}

export function useValenciaFloodedPolygons(): CsvPolygon[] | null {
    const [polygons, setPolygons] = useState<CsvPolygon[] | null>(null);

    useEffect(() => {
        fetch("/flooded_area.csv")
            .then(res => res.text())
            .then((csv) => {
                const lines = csv.split('\n').slice(1); // Skip header
                const result: CsvPolygon[] = [];

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
                        // Parse WKT polygon string to coordinates
                        const coords = parseWktPolygon(wkt);
                        result.push({ name, coords });
                    } catch (error) {
                        // Skip lines with invalid WKT format or coordinates
                        // Optionally, could log error here if needed
                    }
                }
                setPolygons(result);
            })
            .catch(() => {
                // In case of fetch error, set polygons to null or handle accordingly
                setPolygons(null);
            });
    }, []);

    return polygons;
}