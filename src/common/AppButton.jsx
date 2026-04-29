import { Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const AppButton = ({
                       label,
                       variant = "contained",
                       color ,
                       onClick,
                       fullWidth = false,
                       startIcon,
                       endIcon,
                       disabled = false,
                       size = "medium",
                       type = "button",
                       mb=0,
                       // Permission props
                       permission,
                       permissions,
                       requireAll = true,
                       hideIfNoPermission = false,
                       ...otherProps
                   }) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

    // Check permissions
    let hasAccess = true;
    if (permission) {
        hasAccess = hasPermission(permission);
    } else if (permissions && permissions.length > 0) {
        hasAccess = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
    }

    // Hide button if no permission and hideIfNoPermission is true
    if (!hasAccess && hideIfNoPermission) {
        return null;
    }
    return (
        <Button
            variant={variant}
            onClick={onClick}
            fullWidth={fullWidth}
            startIcon={startIcon}
            endIcon={endIcon}
            disabled={disabled || !hasAccess}
            size={size}
            type={type}
            sx={{
                color: "white",
                textTransform: "none",
                borderRadius: "2px",
                padding: "6px 25px",
                backgroundColor:color == null ? "primaryColor":color,
                "&:hover": {
                    backgroundColor: "primaryColor",
                },
                mb:mb

            }}
            {...otherProps}
        >
            {label}

        </Button>
    );
};

export default AppButton;
