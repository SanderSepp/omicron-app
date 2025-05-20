import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Map",
  description: "Interactive map view",
}

export default function MapPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Map View</h1>
      <div className="w-full h-[600px] bg-gray-100 rounded-lg">
        {/* Map content will be added here */}
      </div>
    </main>
  )
}
