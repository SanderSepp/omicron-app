import { UserProfile } from "@/app/profile/page";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  profile: UserProfile;
}

const keysToCheck = [
  "hasChildren",
  "medications",
  "conditions",
  "dependents",
  "allergies",
] as const;

function collectPresentKeys(p: UserProfile) {
  return keysToCheck.filter((key) => {
    const val = p[key];
    if (Array.isArray(val)) {
      return val.length > 0;
    }
    // for numbers (0 is falsy but you might still want to include it—adjust as needed)
    return val !== undefined && val !== null && val !== false;
  });
}

export default function ProfileGuidance({ profile }: Props) {
  const types = collectPresentKeys(profile);

  console.log('types', types);
  const { data } = useQuery({
    queryKey: ['profileData', types],
    queryFn: async () => {
      if (!types) return [];
      const res = await fetch(`/api/openai?types=${types.join(",")}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });
  return (
    <div className="space-y-6">
      {Array.isArray(data) && data.length > 0 && (
        <div className="space-y-6">
          {data.map((entry: { type: string; guides: string[] }) => (
            <Card key={entry.type}>
              <CardHeader>
                <CardTitle className="capitalize">{entry.type}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {entry.guides.map((guide, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">•</span>
                    <p className="text-sm text-muted-foreground">{guide}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
