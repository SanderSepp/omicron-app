'use client';

import { createContext, useContext, useState } from 'react';

const AppStateContext = createContext({});

export function AppStateProvider({ children }: any ) {
    const [userLocation, setUserLocation] = useState(null);
    const [places, setPlaces] = useState([]);
    const [event, setEvent] = useState('calm');

    return (
        <AppStateContext.Provider value={{ userLocation, setUserLocation, places, setPlaces, event, setEvent }}>
            {children}
        </AppStateContext.Provider>
    );
}

export const useAppState = () => useContext(AppStateContext);