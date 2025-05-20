"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { type } from "@/app/api/openai/route";

function showNotification(title: string, body: string, url?: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('This browser does not support notifications.')
    return
  }

  if (Notification.permission === 'granted') {
    const notif = new Notification(title, {
      body,
      // icon: '/icons/alert.png', // ← optional
    })
    if (url) {
      notif.onclick = () => {
        window.open(url, '_self')
      }
    }
  } else {
    console.warn('Notification permission not granted.')
  }
}

function setEventToLocalStorage(event: z.infer<typeof type>) {
  localStorage.setItem('event', event)
}

export function NavBar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <NavigationMenu>
          <NavigationMenuList>

            <NavigationMenuItem>
              <Link href="/" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Crisis Map
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/live-updates" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Live Updates
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/profile" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/guidance" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Guidance
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <Button
              onClick={() => {
                showNotification('⚠️ Weather Alert', 'Storm is coming', "http://localhost:3000/live-updates");
                setEventToLocalStorage("thunderStorm")
              }
              }
            >
              1: Storm is coming
            </Button>
            <Button
              onClick={() => {
                showNotification('⚠️ Weather Alert', 'Storm here!', "http://localhost:3000/");
              }
              }
            >
              2: Storm here
            </Button>
            <Button
              onClick={() =>
                showNotification('ℹ️ Crisis Guidance', 'See crisis guidance', "http://localhost:3000/guidance")
              }
            >
              3: See crisis guidance
            </Button>
            <Button
              onClick={() => {
                showNotification('ℹ️ FLOOD', 'FLOOD', "http://localhost:3000/");
                setEventToLocalStorage("flood")
              }
              }
            >
              3: FLOOD
            </Button>
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
    </nav>
  );
}
