const formatDateTime = (date) => {
    if (!date) return "-";

    let d;
    if (Array.isArray(date)) {
        // Java LocalDateTime serialised without WRITE_DATES_AS_TIMESTAMPS=false produces
        // an array: [year, month, day, hour, minute, second, nano].
        // month is 1-based in Java but 0-based in JS Date constructor.
        const [year, month, day, hour = 0, minute = 0, second = 0] = date;
        d = new Date(year, month - 1, day, hour, minute, second);
    } else {
        // ISO-8601 string e.g. "2026-03-27T10:30:45" — standard case after the backend fix
        d = new Date(date);
    }

    if (isNaN(d.getTime())) return "-";

    return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export { formatDateTime };
export * from './validationHelper';


export const formatDate = (date) => {
    if (!date) return "-";

    // Format date as DD-MM-YYYY
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}-${month}-${year}`;
};

export * from "./validationHelper";