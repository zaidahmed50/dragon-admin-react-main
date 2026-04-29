import { useMemo } from 'react';

export const useMapData = (selectedMainArea, subAreas, dpPorts) => {
    const mainAreaCoords = useMemo(() => {
        if (selectedMainArea?.areaBoundingBox) {
            try {
                return selectedMainArea.areaBoundingBox.split(';').map(coord => {
                    const [lat, lng] = coord.split(',');
                    return { lat: parseFloat(lat), lng: parseFloat(lng) };
                });
            } catch (e) {
                console.error("Error parsing main area bounding box:", e);
                return [];
            }
        }
        return [];
    }, [selectedMainArea]);

    const subAreaPolygons = useMemo(() => {
        if (!subAreas) return [];
        return subAreas
            .filter(sa => sa.subAreaBoundingBox)
            .map(sa => {
                try {
                    return {
                        id: sa.id,
                        paths: sa.subAreaBoundingBox.split(';').map(coord => {
                            const [lat, lng] = coord.split(',');
                            return { lat: parseFloat(lat), lng: parseFloat(lng) };
                        })
                    };
                } catch (e) {
                    console.error("Error parsing sub area bounding box:", e);
                    return null;
                }
            })
            .filter(Boolean);
    }, [subAreas]);

    const dpMarkers = useMemo(() => {
        if (!dpPorts) return [];
        return dpPorts.map(dp => ({
            id: dp.id,
            position: { lat: parseFloat(dp.lat), lng: parseFloat(dp.lng) },
            name: dp.dpName,
        }));
    }, [dpPorts]);

    return { mainAreaCoords, subAreaPolygons, dpMarkers };
};
