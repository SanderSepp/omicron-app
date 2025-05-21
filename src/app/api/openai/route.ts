import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

export const type = z.enum(["flood", "earthQuake", "potentialFlooding", "medications", "allergies", "hasChildren", "dependents", 'calm']);
const guidelines = z.object({
  type: type,
  guides: z.array(z.string()),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const typesParam = searchParams.get("types");

  const types = typesParam ? typesParam.split(",") : [];

  const guides: z.infer<typeof guidelines>[] = [
    {
      type: "calm", guides: [
        "Move to higher ground immediately and avoid low-lying areas.",
        "Do not walk, swim, or drive through floodwaters; just six inches of moving water can knock you down.",
      ]
    },
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
      type: "potentialFlooding",
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
    {
      type: "allergies",
      guides: [
        "Review and confirm your list of allergens (e.g., nuts, shellfish, pollen).",
        "Pack safe snacks/meals that you know are free from your allergens.",
        "Always carry at least two doses of your emergency medication (epi-pen, antihistamine).",
        "Set a phone reminder to check labels whenever you’re offered new food.",
        "Ensure event staff or hosts are aware of your allergy profile in advance."
      ]
    },
    {
      type: "medications",
      guides: [
        "List every daily prescription and OTC medication you take, with dosage times.",
        "Store a 1–2-day buffer supply plus printed prescriptions or doctor’s note.",
        "Use alarms or an app to remind you at each dosing time.",
        "Check storage needs (refrigeration, light sensitivity) and pack accordingly.",
        "Verify you have backup gear (e.g., inhaler, glucose meter) if needed."
      ]
    },
    {
      type: "hasChildren",
      guides: [
        "Pack age-appropriate snacks, drinks, and any special formula or baby food.",
        "Include diapers, wipes, a change of clothes, and child-safe sunscreen/bug spray.",
        "Bring quiet toys, books, or a tablet with headphones for downtime.",
        "Confirm car-seat/stroller logistics (rental vs. bringing your own).",
        "Share your child’s routine (nap/meal times) with any caregiver or host."
      ]
    }
  ];

  return NextResponse.json(
    guides.filter(guide => types.includes(guide.type))
  );
}
