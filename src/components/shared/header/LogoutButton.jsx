import React from 'react';
import { LogOut } from 'lucide-react';
import {useLogout} from "@/hooks/logOut.jsx";
import AppButton from "../../../common/AppButton.jsx";
import {FiLogOut} from "react-icons/fi"; // Modern icon library

const LogoutButton = () => {
    const logout = useLogout();

    return (
        <AppButton
            onClick={logout}
            label="Log Out"
            startIcon={<FiLogOut />}
        >


        </AppButton>
    );
};

export default LogoutButton;