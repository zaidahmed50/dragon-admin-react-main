import { useCallback } from 'react';

export const useFileDownload = () => {
    const getSafeFileName = (url) => {
        const name = url.split('/').pop() || "download";
        return name.length > 50 ? `${name.substring(0, 40)}...${name.slice(-7)}` : name;
    };

    const handleDownload = useCallback(async (e, imageUrl) => {
        e.preventDefault();
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = getSafeFileName(imageUrl);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading the image:', error);
            window.open(imageUrl, '_blank');
        }
    }, []);

    return { handleDownload };
};
