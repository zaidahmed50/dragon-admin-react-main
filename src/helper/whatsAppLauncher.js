export const handleWhatsAppClick = (event, phoneNumber) => {
    event.stopPropagation();

    if (!phoneNumber) return;

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};
