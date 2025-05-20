// app/page.tsx

import { WeatherCard } from "@/app/live-updates/components/weather-updates";

export default function Page() {
  // hard-code or derive from user geo/ip
  const lat = 59.4370;
  const lon = 24.7536; // Tallinn

  return (
    <main className="flex justify-center">
      <WeatherCard lat={lat} lon={lon} />
    </main>
  );
}
