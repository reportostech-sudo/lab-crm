'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getActiveCollectors } from '@/app/lib/tracking-actions';
import L from 'leaflet';

// Fix Leaflet Default Icon issue in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Collector {
    id: string;
    name: string | null;
    email: string;
    lastLat: number | null;
    lastLng: number | null;
    lastLocationUpdate: Date | null;
}

export default function LiveMap() {
    const [collectors, setCollectors] = useState<Collector[]>([]);

    const fetchCollectors = async () => {
        const data = await getActiveCollectors();
        // Ensure types match what we expect (handling potentially null lat/lng from DB)
        const validCollectors = data.filter(c => c.lastLat !== null && c.lastLng !== null) as Collector[];
        setCollectors(validCollectors);
    };

    useEffect(() => {
        fetchCollectors();
        const interval = setInterval(fetchCollectors, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    // Default center (can be adjusted or dynamic)
    const center: [number, number] = [27.7172, 85.3240]; // Kathmandu example

    return (
        <MapContainer center={center} zoom={13} style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {collectors.map((collector) => (
                <Marker
                    key={collector.id}
                    position={[collector.lastLat!, collector.lastLng!]}
                >
                    <Popup>
                        <div className="text-sm">
                            <p className="font-bold">{collector.name || collector.email}</p>
                            <p className="text-gray-500 text-xs">
                                Updated: {new Date(collector.lastLocationUpdate!).toLocaleTimeString()}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
