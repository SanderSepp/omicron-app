// guidance/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

export default function GuidancePage() {
  const [type, setType] = useState('flood');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['openaiData', type],
    queryFn: async () => {
      const res = await fetch(`/api/openai?type=${type}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className={cn("space-x-2")}>
        <Button onClick={() => setType("flood")}>Flood</Button>
        <Button onClick={() => setType("earthQuake")}>Earthquake</Button>
        <Button onClick={() => setType("thunderStorm")}>Thunderstorm</Button>
      </div>
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
