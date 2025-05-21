// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
import { AlertType } from "@/app/api/openai/route";
import {useAppState} from "@/app/AppContext";

function showNotification(title: string, body: string, url?: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('This browser does not support notifications.')
    return
  }

  if (Notification.permission === 'granted') {
    // const notif = new Notification(title, {
    //   body,
    //   // icon: '/icons/alert.png', // ← optional
    // })
    // alert(title + " " + body)
    // if (url) {
    //   notif.onclick = () => {
    //     // window.open(url, '_self')
    //   }
    // }
  } else {
    console.warn('Notification permission not granted.')
  }
}

function setEventToLocalStorage(event: z.infer<typeof AlertType>) {
  localStorage.setItem('event', event)
}

function isMapPage(): boolean {
  return window.location.pathname.includes('/map');
}

export function NavBar() {
  const { setEvent } = useAppState();

  return (
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">
                    LifeAid
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/map">
                    Map
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/*<NavigationMenuItem>*/}
              {/*  <Link href="/live-updates" passHref>*/}
              {/*    <NavigationMenuLink className={navigationMenuTriggerStyle()}>*/}
              {/*      Live Updates*/}
              {/*    </NavigationMenuLink>*/}
              {/*  </Link>*/}
              {/*</NavigationMenuItem>*/}

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/profile">
                    Profile
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/*<NavigationMenuItem>*/}
              {/*  <Link href="/guidance" passHref>*/}
              {/*    <NavigationMenuLink className={navigationMenuTriggerStyle()}>*/}
              {/*      Guidance*/}
              {/*    </NavigationMenuLink>*/}
              {/*  </Link>*/}
              {/*</NavigationMenuItem>*/}
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
              EVENT: CALM
            </Button>

            <Button
                onClick={() => {
                  showNotification('⚠️ Weather Alert', 'Heavy rainfall in mountains - potential flooding in your area in next 24h!', "http://localhost:3000/");
                  setEventToLocalStorage("potentialFlooding")
                  setEvent("potentialFlooding")
                }}
            >
              EVENT: POTENTIAL FLOODING
            </Button>
            <Button
                onClick={() => {
                  showNotification('ℹ️ FLOOD', 'Heavy flooding in your area', "http://localhost:3000/");
                  setEventToLocalStorage("flood")
                  setEvent("flood")
                }}
            >
              EVENT: FLOODING
            </Button>
          </div>
        </div>
      </nav>
  );
}
