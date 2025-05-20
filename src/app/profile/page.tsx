// app/profile/page.tsx
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type EmergencyContact = {
  name: string;
  relation: string;
  phone: string;
};

type UserProfile = {
  name: string;
  age: number;
  maintainables: number;
  hasChildren: boolean;
  medications: string[];
  allergies: string[];
  emergencyContact: EmergencyContact;
  conditions: string[];
};

const mockUser: UserProfile = {
  name: "Jane Doe",
  age: 34,
  maintainables: 2,
  hasChildren: true,
  medications: ["Ibuprofen", "Metformin"],
  allergies: ["Peanuts", "Penicillin"],
  emergencyContact: {
    name: "John Doe",
    relation: "Husband",
    phone: "+123456789",
  },
  conditions: ["Hypertension", "Asthma"],
};

export default function ProfilePage() {
  return (
    <main className="p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              {/* If you have a real avatar URL, put it in src="" */}
              <AvatarImage src="" alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{mockUser.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Age {mockUser.age}</p>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Maintainables</p>
              <p className="text-lg">{mockUser.maintainables}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Has Children</p>
              <Badge variant={mockUser.hasChildren ? "default" : "secondary"}>
                {mockUser.hasChildren ? "Yes" : "No"}
              </Badge>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Conditions</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {mockUser.conditions.map((condition) => (
                  <Badge key={condition}>{condition}</Badge>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Medications</p>
              <p className="mt-1">{mockUser.medications.join(", ")}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Allergies</p>
              <p className="mt-1">{mockUser.allergies.join(", ")}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
            <div className="mt-2 space-y-1">
              <p>
                <span className="font-semibold">Name:</span> {mockUser.emergencyContact.name}
              </p>
              <p>
                <span className="font-semibold">Relation:</span> {mockUser.emergencyContact.relation}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {mockUser.emergencyContact.phone}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
