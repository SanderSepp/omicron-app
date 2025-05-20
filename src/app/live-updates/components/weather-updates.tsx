// app/components/WeatherCard.tsx
"use client";

import useSWR from "swr";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function WeatherCard({
                              lat,
                              lon,
                            }: {
  lat: number;
  lon: number;
}) {
  const { data, error } = useSWR(
    `/api/weather?lat=${lat}&lon=${lon}`,
    fetcher,
    { refreshInterval: 60 * 1000 } // 60s polling
  );

  if (error)
    return (
      <Card>
        <CardContent>Error loading weather</CardContent>
      </Card>
    );
  if (!data)
    return (
      <Card>
        <CardContent>Loading…</CardContent>
      </Card>
    );

  const {
    main: { temp, humidity },
    weather: [w],
    dt,
  } = data;

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>Live Weather</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="text-4xl font-bold">{Math.round(temp)}°C</div>
        <div className="capitalize">{w.description}</div>
        <div>Humidity: {humidity}%</div>
        <div className="text-xs text-gray-500">
          Updated at {new Date(dt * 1000).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
