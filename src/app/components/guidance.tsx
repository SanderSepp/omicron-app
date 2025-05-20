import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  guidanceType?: string;
}
export default function Guidance({ guidanceType }: Props) {
  const { data } = useQuery({
    queryKey: ['openaiData', guidanceType],
    queryFn: async () => {
      if (!guidanceType) return [];
      const res = await fetch(`/api/openai?type=${guidanceType}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  if (!guidanceType) {
    return (
      <div className="p-4 space-y-6">
        <Card className="p-4">
          <CardTitle className="whitespace-nowrap">You are safe!</CardTitle>
        </Card>
      </div>
    );
  }

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
