import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Weather App</h1>
      <Link href="/map" className="mt-4">Map</Link>
      <Link href="/live-updates" className="mt-4">Live updates</Link>
      <p className="mt-4 text-lg">Get the latest crisis guidance!</p>
    </main>
  );
}