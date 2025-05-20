import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("lon");
    const radius = searchParams.get("radius");
    if (!latitude || !longitude) {
        return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
    }

    const res = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
            method: "POST",
            body: "data="+ encodeURIComponent(`
            [out:json];
            (
              node["amenity"="drinking_water"](around:${radius},${latitude},${longitude});
              node["shelter"="yes"](around:${radius},${latitude},${longitude});
              node["shop"="supermarket"](around:${radius},${latitude},${longitude});
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