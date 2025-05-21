import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

export const type = z.enum(["flood", "potentialFlooding", "medications", "allergies", "hasChildren", "dependents", 'calm']);
export type AlertType = z.infer<typeof type>;
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
        "Assamble a personalized waterproof emergency kit:diabetes medication, insulin, testersallergy medications grandmother´s medication",
        "Develop an accessible evacuation plan wheelchair accessible routes and shelters",
        "Stay Informed and Ready"
      ]
    },
    {
      type: "flood", guides: [
        "Stay indoors and avoid water contact",
        "Unplug electrical appliances",
        "Avoid driving",
        "Check your blood sugar condition regulary",
        "Check your grandmother´s health regulary"
      ]
    },
    {
      type: "potentialFlooding",
      guides: [
        "Crab your emergency kit",
        "Move to higher ground immediately",
        "Pick wheelchair accessible routes",
        "Avoid floodwaters",
        "Stay informed and follow official Instructions"
      ]
    },
  ];

  return NextResponse.json(
    guides.filter(guide => types.includes(guide.type))
  );
}
