// hooks/useFloodedCoords.ts
import { useEffect, useState } from "react";

type LatLngTuple = [number, number];

export function useFloodedCoords(): LatLngTuple[][] | null {
    const [coords, setCoords] = useState<LatLngTuple[][] | null>(null);

    useEffect(() => {
        fetch("/flooded_general.geojson")
            .then(res => res.json())
            .then((geojson) => {
                const polygons: LatLngTuple[][] = [];

                geojson.features.forEach((feature: any) => {
                    if (feature.geometry.type === "MultiPolygon") {
                        feature.geometry.coordinates.forEach((polygon: any) => {
                            // Each polygon is an array of linear rings; use only outer ring [0]
                            polygons.push(
                                polygon[0].map(
                                    ([lng, lat]: [number, number]) => [lat, lng]
                                )
                            );
                        });
                    } else if (feature.geometry.type === "Polygon") {
                        polygons.push(
                            feature.geometry.coordinates[0].map(
                                ([lng, lat]: [number, number]) => [lat, lng]
                            )
                        );
                    }
                });

                setCoords(polygons);
            });
    }, []);

    return coords;
}