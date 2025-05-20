import { MapPoint } from "@/lib/types";

export const samplePoints: MapPoint[] = [
  {
    id: '1',
    name: 'Central Park',
    description: 'A large public park in Manhattan, New York City.',
    latitude: 59.43228257389738,
    longitude: 24.714579088702287,
    address: 'Central Park, New York, NY',
    instructions: 'Enter from the south entrance and follow the main path.'
  },
  {
    id: '2',
    name: 'Empire State Building',
    description: 'A 102-story skyscraper in Midtown Manhattan.',
    latitude: 59.44908355227742,
    longitude: 24.71106003051386,
    address: '350 5th Ave, New York, NY 10118',
    instructions: 'The main entrance is on 5th Avenue. Tickets can be purchased on the 2nd floor.'
  },
  {
    id: '3',
    name: 'Times Square',
    description: 'A major commercial intersection and tourist destination.',
    latitude: 59.43756378050697,
    longitude: 24.793028337097955,
    address: 'Times Square, New York, NY 10036',
    instructions: 'The red steps provide a great viewing spot for the billboards and activity.'
  },
  {
    id: '4',
    name: 'Statue of Liberty',
    description: 'Iconic symbol of freedom and democracy.',
    latitude: 59.40737067792505,
    longitude: 24.72083621117484,
    address: 'Liberty Island, New York, NY 10004',
    instructions: 'Take the ferry from Battery Park. Advanced reservations recommended.'
  },
  {
    id: '5',
    name: 'Brooklyn Bridge',
    description: 'A historic bridge connecting Manhattan and Brooklyn.',
    latitude: 59.41137192032958,
    longitude: 24.687841698584602,
    address: 'Brooklyn Bridge, New York, NY 10038',
    instructions: 'Pedestrian access is available from both Manhattan and Brooklyn sides.'
  }
];

export const sampleRouteInfo = {
  distance: '2.5 miles',
  duration: '35 minutes',
  instructions: [
    'Head north on 5th Ave toward W 34th St',
    'Turn right onto W 42nd St',
    'Continue for 0.5 miles',
    'Turn left onto Broadway',
    'Your destination will be on the right'
  ]
};
