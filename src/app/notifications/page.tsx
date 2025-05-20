"use client";

import { z } from "zod";
import type { type } from "@/app/api/openai/route";
import { Button } from "@/components/ui/button";
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

export default function Notifications() {
    const { event, setEvent } = useAppState();

    return (
    <div className="p-6 space-x-2">
      <Button
        onClick={() => {
          showNotification('⚠️ Weather Alert', 'Storm is coming', "http://localhost:3000/live-updates");
          setEventToLocalStorage("thunderStorm")
            setEvent("thunderStorm")
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
          setEvent('flood')
        }
        }
      >
        3: FLOOD
      </Button>
    </div>
  );
}
