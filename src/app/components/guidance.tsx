import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { FiCloudRain } from "react-icons/fi";
import { FaWater } from "react-icons/fa";
import { LuPartyPopper } from "react-icons/lu";

type EventMetaKey = "flood" | "potentialFlooding" | "calm";

type Props = {
  guidanceType: EventMetaKey;
}

interface EventMeta {
  icon: React.ReactNode
  borderClass: string
  bgClass: string
  textClass: string
}

const EVENT_META: Record<EventMetaKey, EventMeta> = {
  potentialFlooding: {
    icon: <FiCloudRain size={24} />,
    borderClass: 'border-amber-600',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-600',
  },
  flood: {
    icon: <FaWater size={24} />,
    borderClass: 'border-red-600',
    bgClass: 'bg-red-100',
    textClass: 'text-red-600',
  },
  calm: {
    icon: <LuPartyPopper size={24} />, // swap in any child‐friendly icon
    borderClass: 'border-green-600',
    bgClass: 'bg-green-100',
    textClass: 'text-green-600',
  },
}

export default function Guidance({ guidanceType }: Props) {

  const { data } = useQuery({
    queryKey: ['openaiData', guidanceType],
    queryFn: async () => {
      if (!guidanceType) return [];
      const res = await fetch(`/api/openai?types=${guidanceType}`);
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

  const { icon, borderClass, bgClass, textClass } = EVENT_META[guidanceType]
  return (
    <>
      {Array.isArray(data) && data.length > 0 && (
        <>
          {data.map((entry: { type: string; guides: string[] }) => (
            <Card
              key={entry.type}
              className={`
              border-2 ${borderClass} ${bgClass}
            `}
            >
              <CardHeader className={`flex items-center pb-2 ${textClass}`}>
                <span className="mr-2">{icon}</span>
                <CardTitle className="text-lg font-semibold">{entry.type.toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="leading-relaxed">
                {entry.guides.map((guide, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-md text-gray-800">•</span>
                    <p className="text-md text-gray-800">{guide}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </>
  );

}
