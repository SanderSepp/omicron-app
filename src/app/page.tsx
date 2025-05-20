"use client";
// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission)
      })
    }
  }, [])

  return (
    <main className="flex flex-col items-center bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-red-600 to-pink-600 text-white py-20">
        <div className="max-w-2xl mx-auto text-center px-4 space-y-4">
          <h1 className="text-5xl font-extrabold">Crisisist</h1>
          <p className="text-lg md:text-xl">
            Personalized crisis behavior guidance when you need it most.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild>
              <Link href="/get-started">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/learn-more">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 w-full">
        <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>🧠 AI-Based Instruction Generator</CardTitle>
              <CardDescription>
                Real-time guidance based on sensors, alerts, and your needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Example: “Power outage detected. Nearest charging station is 1.3 km away. Navigation starting now.”
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🗺️ Crisis Resource Map</CardTitle>
              <CardDescription>Find nearby water points, shelters, and more.</CardDescription>
            </CardHeader>
            <CardContent>
              Includes verified community help points. Crowdsourced & reliable.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔔 Live Crisis Updates</CardTitle>
              <CardDescription>
                Stay informed with data from utilities, traffic & weather.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Push alerts when power or water are restored in your area.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📴 Offline Mode</CardTitle>
              <CardDescription>Critical info, even without internet.</CardDescription>
            </CardHeader>
            <CardContent>
              Preload maps and instructions for emergencies.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👤 User Emergency Profiles</CardTitle>
              <CardDescription>Plan ahead for different crisis scenarios.</CardDescription>
            </CardHeader>
            <CardContent>
              Example: “Kids at school, flood at home.” AI adapts recommendations accordingly.
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="w-1/2" />

      {/* Call to Action */}
      <section className="py-12 text-center px-4">
        <h2 className="text-3xl font-bold mb-2">Ready to take control?</h2>
        <p className="text-muted-foreground mb-4">
          Join Crisisist today and get proactive crisis guidance tailored to you.
        </p>
        <Button size="lg" asChild>
          <Link href="/signup">Sign Up for Free</Link>
        </Button>
      </section>
    </main>
  );
}
