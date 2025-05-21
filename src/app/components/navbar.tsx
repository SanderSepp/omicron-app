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
import {useAppState} from "@/app/AppContext";

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
    alert(title + " " + body)
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
  const { event, setEvent } = useAppState();

  return (
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
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
              <NavigationMenuItem>
                <Link href="/notifications" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Notifications
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
          <div className="space-x-2">
            <Button
              onClick={() => {
                setEventToLocalStorage("calm")
                setEvent("calm")
              }}
            >
              1: Everything is calm
            </Button>

            <Button
              onClick={() => {
                showNotification('⚠️ Weather Alert', 'Storm is coming', "http://localhost:3000/live-updates");
                setEventToLocalStorage("thunderStorm")
                setEvent("thunderStormComing")
              }}
            >
              2: Storm is coming
            </Button>
            <Button
              onClick={() => {
                showNotification('⚠️ Weather Alert', 'Storm here!', "http://localhost:3000/");
                setEvent("thunderStorm")
              }}
            >
              3: Storm here
            </Button>
            <Button
              onClick={() => {
                showNotification('ℹ️ FLOOD', 'FLOOD', "http://localhost:3000/");
                setEventToLocalStorage("flood")
                setEvent("flood")
              }
              }
            >
              4: Flood
            </Button>
          </div>
        </div>
      </nav>
  );
}
