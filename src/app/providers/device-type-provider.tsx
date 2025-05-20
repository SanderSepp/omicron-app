"use client";

import React, { createContext, useContext } from "react";
import { z } from "zod";

export const DeviceTypeSchema = z.enum([
  "desktop",
  "mobile",
  "tablet",
  "console",
  "smarttv",
  "wearable",
  "xr",
  "embedded",
]);

export type DeviceType = z.infer<typeof DeviceTypeSchema>;

interface DeviceContextType {
  device: DeviceType;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceTypeProvider({
  device,
  children,
}: {
  device: DeviceType;
  children: React.ReactNode;
}) {
  return (
    <DeviceContext.Provider value={{ device }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }

  const isMobileDevice = () =>
    context.device === "mobile" || context.device === "tablet";

  return { ...context, isMobileDevice };
}
