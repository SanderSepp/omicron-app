import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

export const type = z.enum(["flood", "potentialFlooding", "medications", "allergies", "hasChildren", "dependents", 'calm']);
const guideline = z.object({
  type: type,
  title: z.string(),
  guides: z.array(z.string()),
});
export type AlertType = z.infer<typeof type>;
export type GuidelineType = z.infer<typeof guideline>;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const typesParam = searchParams.get("types");

  const types = typesParam ? typesParam.split(",") : [];

  const guides: z.infer<typeof guideline>[] = [
    {
      type: "calm",
      title: "You are safe!",
      guides: [
        "Assemble a personalized waterproof emergency kit: diabetes medication, insulin testers, allergy medications grandmother´s medication",
        "Develop an accessible evacuation plan wheelchair accessible routes and shelters",
        "Stay Informed and Ready"
      ]
    },
    {
      type: "flood",
      title: "Flooding!",
      guides: [
        "Stay indoors and avoid water contact",
        "Unplug electrical appliances",
        "Avoid driving",
        "Check your blood sugar condition regularly",
        "Check your grandmother´s health regularly"
      ]
    },
    {
      type: "potentialFlooding",
      title: "It's raining cats and dogs",
      guides: [
        "Crab your emergency kit",
        "Move to higher ground immediately",
        "Pick wheelchair accessible routes",
        "Avoid floodwaters",
        "Stay informed and follow official instructions"
      ]
    },
  ];

  return NextResponse.json(
    guides.filter(guide => types.includes(guide.type))
  );
}
