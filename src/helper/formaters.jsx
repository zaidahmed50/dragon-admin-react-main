export const formatCNIC = (value) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 13);
    if (limited.length <= 5) return limited;
    if (limited.length <= 12)
        return `${limited.slice(0, 5)}-${limited.slice(5)}`;
    return `${limited.slice(0, 5)}-${limited.slice(5, 12)}-${limited.slice(12)}`;
};

export const formatPKMobile = (value = "") => {
    // Remove everything except digits
    let digits = value.replace(/\D/g, "");

    // If starts with country code 92 → remove it and add leading 0
    if (digits.startsWith("92")) {
        digits = "0" + digits.slice(2);
    }

    // Ensure it starts with 03
    if (digits.length && !digits.startsWith("03")) {
        digits = "03" + digits.replace(/^0+/, "");
    }

    // Limit to 11 digits (0300XXXXXXX)
    digits = digits.slice(0, 11);

    // Return early if incomplete
    if (digits.length <= 4) {
        return digits;
    }

    // Final format: 0300 4905014
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
};

export const formatDateWithDash = (dateStr = "") => {
    if (!dateStr) return "";
    return dateStr.replace(/\//g, "-");
};
export const reduceLatLng = (value) => {
    if (value === null || value === undefined || value === "") return null;
    return Number(parseFloat(value).toFixed(6));
};

export default {formatPKMobile,formatCNIC};

