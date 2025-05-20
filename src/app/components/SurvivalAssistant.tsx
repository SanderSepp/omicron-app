import { useState } from 'react';

export default function SurvivalAssistant({ userLocation }: { userLocation: { lat: number; lng: number } | null }) {
    const [places, setPlaces] = useState([]);
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);

    if (!userLocation) {
        return <p>Please enable location services to use the Survival Assistant.</p>;
    }

    const fetchResources = async () => {
        setLoading(true);
        try {
            const queryRes = await fetch(`/api/map?lat=${userLocation.lat}&lon=${userLocation.lng}&radius=${1000}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await queryRes.json();
            setPlaces(data);

            // Step 2: Call /api/explain with returned data
            const explainRes = await fetch('/api/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const explainData = await explainRes.json();
            setExplanation(explainData.explanation);

        } catch (error) {
            console.error('Error fetching survival data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <button onClick={fetchResources} className="px-4 py-2 bg-blue-600 text-white rounded">
                Analyze Area
            </button>

            {loading && <p>Loading...</p>}

            {places.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-bold">Nearby Resources:</h3>
                    <ul className="list-disc list-inside">
                        {places.map((p: any, idx) => (
                            <li key={idx}>
                                <strong>{p.name}</strong> ({p.type}) at ({p.lat.toFixed(4)}, {p.lon.toFixed(4)})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {explanation && (
                <div className="mt-6 bg-gray-100 p-3 rounded">
                    <h3 className="font-bold">Survival Analysis:</h3>
                    <p>{explanation}</p>
                </div>
            )}
        </div>
    );
}