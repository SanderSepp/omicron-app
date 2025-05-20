import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

export const type = z.enum(["flood", "earthQuake", "thunderStorm"]);
const guidelines = z.object({
  type: type,
  guides: z.array(z.string()),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const guides: z.infer<typeof guidelines>[] = [
    {
      type: "flood", guides: [
        "Move to higher ground immediately and avoid low-lying areas.",
        "Do not walk, swim, or drive through floodwaters; just six inches of moving water can knock you down.",
        "Stay informed by listening to local weather updates and emergency instructions.",
        "Disconnect electrical appliances if instructed to evacuate.",
        "Avoid bridges over fast-moving water as they can be unstable.",
        "Seal off basement windows and doors if there's time.",
        "If trapped in a building, go to the highest level. Do not climb into a closed attic; you may become trapped by rising water.",
        "Do not return to the flooded area until authorities declare it safe."
      ]
    },
    {
      type: "earthQuake", guides: [
        "Drop to your hands and knees, cover your head and neck under sturdy furniture, and hold on until the shaking stops.",
        "Stay indoors and away from windows, mirrors, and heavy furniture that might topple.",
        "If you're outdoors, move away from buildings, streetlights, and utility wires.",
        "Do not use elevators during or after the quake.",
        "After the shaking stops, check yourself and others for injuries and provide first aid if needed.",
        "Be prepared for aftershocks, which are common after a major quake.",
        "Inspect your home for structural damage, gas leaks, or electrical issues.",
        "Use text messages or social media to communicate with loved ones to keep emergency lines free."
      ]
    },
    {
      type: "thunderStorm",
      guides: [
        "Stay indoors and avoid contact with water – do not bathe or shower.",
        "Unplug electrical appliances and avoid using corded phones.",
        "Stay away from windows and glass doors – close curtains or blinds to reduce the risk of injury from shattered glass.",
        "Avoid open fields, hilltops, or any elevated area if you’re caught outside.",
        "Do not shelter under trees – lightning strikes them often.",
        "Driving in your area is extremely dangerous: there are several reports of fallen trees on the road. Road X has been partially carried away by the flood water.",
        "If you hear thunder, lightning is close enough to strike – wait at least 30 minutes after the last clap of thunder before going outside.",
        "If you need urgent care please update your status on the APP."
      ]
    },
  ];

  return NextResponse.json(guides.filter(guide => guide.type === type));
}
