// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type EmergencyContact = {
  name: string;
  relation: string;
  phone: string;
};

export type UserProfile = {
  name: string;
  age: number;
  dependents: number;
  hasChildren: boolean;
  medications: string[];
  allergies: string[];
  emergencyContact: EmergencyContact;
  conditions: string[];
};

// Eight demo profiles
const defaultProfiles: UserProfile[] = [
  {
    name: "Default",
    age: 34,
    dependents: 2,
    hasChildren: true,
    medications: ["Ibuprofen", "Metformin"],
    allergies: ["Peanuts", "Penicillin"],
    emergencyContact: { name: "John Doe", relation: "Husband", phone: "+123456789" },
    conditions: ["Hypertension", "Asthma"],
  },
  {
    name: "No Medications",
    age: 34,
    dependents: 2,
    hasChildren: true,
    medications: [],
    allergies: ["Peanuts", "Penicillin"],
    emergencyContact: { name: "John Doe", relation: "Husband", phone: "+123456789" },
    conditions: ["Hypertension", "Asthma"],
  },
  {
    name: "No Allergies",
    age: 34,
    dependents: 2,
    hasChildren: true,
    medications: ["Ibuprofen", "Metformin"],
    allergies: [],
    emergencyContact: { name: "John Doe", relation: "Husband", phone: "+123456789" },
    conditions: ["Hypertension", "Asthma"],
  },
  {
    name: "No Children",
    age: 34,
    dependents: 2,
    hasChildren: false,
    medications: ["Ibuprofen", "Metformin"],
    allergies: ["Peanuts", "Penicillin"],
    emergencyContact: { name: "John Doe", relation: "Husband", phone: "+123456789" },
    conditions: ["Hypertension", "Asthma"],
  },
  {
    name: "No Meds & Allergies",
    age: 34,
    dependents: 2,
    hasChildren: true,
    medications: [],
    allergies: [],
    emergencyContact: { name: "John Doe", relation: "Husband", phone: "+123456789" },
    conditions: ["Hypertension", "Asthma"],
  },
  {
    name: "No Meds & No Children",
    age: 34,
    dependents: 2,
    hasChildren: false,
    medications: [],
    allergies: ["Peanuts", "Penicillin"],
    emergencyContact: { name: "John Doe", relation: "Husband", phone: "+123456789" },
    conditions: ["Hypertension", "Asthma"],
  },
  {
    name: "No Allergies & No Children",
    age: 34,
    dependents: 2,
    hasChildren: false,
    medications: ["Ibuprofen", "Metformin"],
    allergies: [],
    emergencyContact: { name: "John Doe", relation: "Husband", phone: "+123456789" },
    conditions: ["Hypertension", "Asthma"],
  },
  {
    name: "Minimal",
    age: 34,
    dependents: 2,
    hasChildren: false,
    medications: [],
    allergies: [],
    emergencyContact: { name: "John Doe", relation: "Husband", phone: "+123456789" },
    conditions: [],
  },
];

export default function ProfilePage() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>(defaultProfiles[0]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Load stored profile (object) on mount
  useEffect(() => {
    const stored = localStorage.getItem("selectedProfile");
    if (stored) {
      try {
        const prof = JSON.parse(stored) as UserProfile;
        const idx = defaultProfiles.findIndex((p) => p.name === prof.name);
        if (idx !== -1) {
          setSelectedProfile(defaultProfiles[idx]);
          setSelectedIndex(idx);
        }
      } catch {
        // ignore parse errors
      }
    } else {
      // initialize storage
      localStorage.setItem("selectedProfile", JSON.stringify(defaultProfiles[0]));
    }
  }, []);

  // Whenever profile changes, persist it
  useEffect(() => {
    localStorage.setItem("selectedProfile", JSON.stringify(selectedProfile));
  }, [selectedProfile]);

  return (
    <main className="p-4 space-y-6">
      {/* Profile selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {defaultProfiles.map((prof, i) => (
          <Button
            key={prof.name}
            variant={i === selectedIndex ? "default" : "outline"}
            onClick={() => {
              setSelectedIndex(i);
              setSelectedProfile(defaultProfiles[i]);
            }}
          >
            {prof.name}
          </Button>
        ))}
      </div>

      {/* Profile display */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="" alt={selectedProfile.name} />
              <AvatarFallback>{selectedProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{selectedProfile.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Age {selectedProfile.age}</p>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">dependents</p>
              <p className="text-lg">{selectedProfile.dependents}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Has Children</p>
              <Badge variant={selectedProfile.hasChildren ? "default" : "secondary"}>
                {selectedProfile.hasChildren ? "Yes" : "No"}
              </Badge>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Conditions</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedProfile.conditions.map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Medications</p>
              <p className="mt-1">{selectedProfile.medications.join(", ") || "None"}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Allergies</p>
              <p className="mt-1">{selectedProfile.allergies.join(", ") || "None"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
            <div className="mt-2 space-y-1">
              <p>
                <span className="font-semibold">Name:</span> {selectedProfile.emergencyContact.name}
              </p>
              <p>
                <span className="font-semibold">Relation:</span> {selectedProfile.emergencyContact.relation}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {selectedProfile.emergencyContact.phone}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
