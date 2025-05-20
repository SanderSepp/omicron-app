import {NextRequest, NextResponse} from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const places: any = await request.json();

    let prompt = `You are a survival assistant. Based on the following list of locations, give a brief analysis on:\n- Which locations provide clean drinking water\n- Which can be used as emergency shelters\n- Where food or supplies may be available\n\nList of places:\n`;
    places.forEach((p: any) => {
        prompt += `- ${p.name} (${p.type}) at (${p.lat}, ${p.lon})\n`;
    });
    prompt += '; return the response as json and each location should have a "name", "type", "lat", "lon" and "description" field.\n\n';

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    console.log(apiKey);
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
        model: "gpt-4.1",
        input: prompt
    });

    return NextResponse.json(places);
}
