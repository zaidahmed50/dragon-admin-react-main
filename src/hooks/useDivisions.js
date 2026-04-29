import {useEffect, useState} from "react";
import DivisionServices from "../services/divisionsServices.js";

export const useDivisions = () => {
    const [divisions, setDivisions] = useState([]);

    useEffect(() => {
        DivisionServices.getAllDivisions().then(result => {
            if (result.data) {
                const formattedDivisions = result.data.map(division => ({
                    label: division.title,
                    value: division.id,
                    code: division.code  // Add code field for matching
                }));
                setDivisions(formattedDivisions);
            }
        });
    }, []);

    return { divisions };
}
