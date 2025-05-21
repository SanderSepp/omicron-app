
export interface MapPoint {
  id: string;
  name?: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  instructions?: string;
  tags?: any[]
}

export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  instructions: string[];
}
