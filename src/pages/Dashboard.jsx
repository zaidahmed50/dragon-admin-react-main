import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getAllAccessibleRoutes } from '../utils/routeUtils';
import { Link } from 'react-router-dom';
import { 
    User, 
    Users, 
    ShoppingCart, 
    Package, 
    MapPin, 
    Building, 
    Lock,
    BarChart
} from 'lucide-react';

const Dashboard = () => {
    const { user, isSuperAdmin } = useAuth();
    
    const getIcon = (path) => {
        if (path.includes('employee')) return <Users size={40} />;
        if (path.includes('customer')) return <User size={40} />;
        if (path.includes('inventory') || path.includes('stock')) return <Package size={40} />;
        if (path.includes('area')) return <MapPin size={40} />;
        if (path.includes('office')) return <Building size={40} />;
        if (path.includes('admin') || path.includes('access')) return <Lock size={40} />;
        if (path.includes('order') || path.includes('purchase')) return <ShoppingCart size={40} />;
        return <BarChart size={40} />;
    };

    const userPermissions = user?.authorities || [];
    const accessibleRoutes = getAllAccessibleRoutes(userPermissions, isSuperAdmin());

    return (
        <Box sx={{ p: 3 }}>
            {/* Welcome Section */}
            <Box mb={4}>
                <Typography variant="h4" gutterBottom>
                    Welcome back, {user?.name}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {user?.userType} • {user?.email}
                </Typography>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                User Type
                            </Typography>
                            <Typography variant="h5">
                                {user?.userType}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Accessible Modules
                            </Typography>
                            <Typography variant="h5">
                                {accessibleRoutes.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Permissions
                            </Typography>
                            <Typography variant="h5">
                                {userPermissions.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Accessible Modules */}
            <Box mb={4}>
                <Typography variant="h5" gutterBottom>
                    Your Accessible Modules
                </Typography>
                
                {accessibleRoutes.length > 0 ? (
                    <Grid container spacing={3} mt={1}>
                        {accessibleRoutes.map((route, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    <CardContent 
                                        component={Link} 
                                        to={route.path}
                                        sx={{ 
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            py: 3
                                        }}
                                    >
                                        <Box 
                                            sx={{ 
                                                color: 'primary.main',
                                                mb: 2
                                            }}
                                        >
                                            {getIcon(route.path)}
                                        </Box>
                                        <Typography variant="h6" gutterBottom>
                                            {route.label}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {route.permission}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        You don't have access to any modules yet. Please contact your administrator to assign permissions.
                    </Alert>
                )}
            </Box>

            {/* Permission Info */}
            {!isSuperAdmin() && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Your Permissions
                    </Typography>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {userPermissions.map((permission, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            px: 2,
                                            py: 0.5,
                                            backgroundColor: 'primary.light',
                                            color: 'primary.contrastText',
                                            borderRadius: 1,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {permission}
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
