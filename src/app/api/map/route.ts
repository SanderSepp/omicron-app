import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("lon");
    const radius = searchParams.get("radius");
    const water = searchParams.get("water");
    const shelter = searchParams.get("shelter");
    const supermarket = searchParams.get("supermarket");
    const pharmacy = searchParams.get("pharmacy");
    if (!latitude || !longitude) {
        return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
    }

    let queryParams = '';
    if (water) queryParams += `node["amenity"="drinking_water"](around:${radius},${latitude},${longitude});`
    if (shelter) queryParams += `node["shelter"="yes"](around:${radius},${latitude},${longitude});`
    if (supermarket) queryParams += `node["shop"="supermarket"](around:${radius},${latitude},${longitude});`
    if (pharmacy) queryParams += `node["amenity"="pharmacy"](around:${radius},${latitude},${longitude});`

    const res = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
            method: "POST",
            body: "data="+ encodeURIComponent(`
            [out:json];
            (
                ${queryParams}
            );
            out body;
        `)
        },
    )

    const data = await res.json();
    const elements = data.elements || [];
    const places = elements.map((el: any) => {
        const tags = el.tags || {};
        const name = tags.name || 'Unknown';
        const type = tags.amenity || tags.shelter || tags.shop || 'unknown';
        return { name, type, lat: el.lat, lon: el.lon, tags };
    });

    return NextResponse.json(places);
}