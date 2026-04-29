import {
    FiUsers, FiPackage, FiHelpCircle, FiBox, FiList,
    FiEye, FiMapPin, FiLayers, FiShare2, FiGlobe,
    FiSettings, FiDollarSign, FiTrendingUp, FiTruck,
    FiShield, FiTag, FiShoppingBag, FiLifeBuoy, FiGrid,
    FiClipboard, FiCheckSquare, FiDatabase
} from "react-icons/fi";
import { FaReact, FaWarehouse, FaSitemap } from "react-icons/fa";

/**
 * Returns a React icon component based on the provided icon name/key
 */
const getIcon = (iconKey) => {
    if (!iconKey) return <FiHelpCircle />;

    switch (iconKey.toLowerCase()) {
        // Main Categories
        case "employee": return <FiUsers />;
        case "customer": return <FiUsers />;
        case "core": return <FaReact />;
        case "inventory": return <FiPackage />;
        case "stock": return <FaWarehouse />;
        case "help": return <FiHelpCircle />;

        // Dropdown Items
        case "list": return <FiList />;
        case "view": return <FiEye />;
        case "map": return <FiMapPin />;
        case "org": return <FaSitemap />;
        case "port": return <FiShare2 />;
        case "network": return <FiGlobe />;
        case "location": return <FiMapPin />;
        case "user-settings": return <FiSettings />;
        case "money": return <FiDollarSign />;
        case "trending": return <FiTrendingUp />;
        case "vendor": return <FiTruck />;
        case "manager": return <FiUsers />;
        case "lock": return <FiShield />;
        case "category": return <FiLayers />;
        case "sub-category": return <FiTag />;
        case "brand": return <FiPackage />;
        case "order": return <FiShoppingBag />;
        case "box": return <FiBox />;
        case "support": return <FiLifeBuoy />;
        case "dashboard": return <FiGrid />;
        case "task":   return <FiCheckSquare />;
        case "backup": return <FiDatabase />;

        default:
            return <FiHelpCircle />;
    }
};

export default getIcon;