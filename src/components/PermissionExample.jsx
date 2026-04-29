import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Tooltip,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Upload as UploadIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import AppButton from '../common/AppButton';
import PermissionGuard from './PermissionGuard';
import { usePermission } from '../hooks/usePermission';
import { useAuth } from '../contexts/AuthContext';

/**
 * This component demonstrates various ways to implement permission-based UI
 * Copy these patterns into your actual components
 */
const PermissionExample = () => {
    const { user } = useAuth();
    const { can, canAny, canAll, isSuperAdmin } = usePermission();
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Permission-Based UI Examples
            </Typography>

            {/* User Info */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">Current User Information</Typography>
                <Typography>Name: {user?.name}</Typography>
                <Typography>Email: {user?.email}</Typography>
                <Typography>Type: {user?.userType}</Typography>
                <Typography>Super Admin: {isSuperAdmin() ? 'Yes' : 'No'}</Typography>
                <Typography variant="caption" display="block" mt={1}>
                    Permissions: {user?.authorities?.length || 0} total
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {/* Example 1: AppButton with Permissions */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                1. AppButton with Permissions
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Buttons automatically disable or hide based on permissions
                            </Typography>

                            <Box display="flex" flexDirection="column" gap={2}>
                                {/* Hide if no permission */}
                                <AppButton
                                    label="Create Employee (Hidden if no perm)"
                                    permission="EMPLOYEE_CREATE"
                                    hideIfNoPermission={true}
                                    startIcon={<AddIcon />}
                                    onClick={() => alert('Create clicked')}
                                />

                                {/* Disable if no permission */}
                                <AppButton
                                    label="Update Employee (Disabled if no perm)"
                                    permission="EMPLOYEE_UPDATE"
                                    startIcon={<EditIcon />}
                                    onClick={() => alert('Update clicked')}
                                />

                                {/* Multiple permissions - any required */}
                                <AppButton
                                    label="View or Edit (Any permission)"
                                    permissions={['EMPLOYEE_GET', 'EMPLOYEE_UPDATE']}
                                    requireAll={false}
                                    startIcon={<ViewIcon />}
                                    onClick={() => alert('View/Edit clicked')}
                                />

                                {/* Multiple permissions - all required */}
                                <AppButton
                                    label="Full Access (All permissions)"
                                    permissions={['EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_DELETE']}
                                    requireAll={true}
                                    onClick={() => alert('Full access action')}
                                />
                            </Box>

                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="caption">
                                    <strong>Code:</strong><br />
                                    {`<AppButton
    label="Create"
    permission="EMPLOYEE_CREATE"
    hideIfNoPermission={true}
    onClick={handleCreate}
/>`}
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Example 2: PermissionGuard Component */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                2. PermissionGuard Component
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Conditionally render entire sections
                            </Typography>

                            {/* Single permission */}
                            <PermissionGuard permission="EMPLOYEE_DELETE">
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        🔒 Danger Zone - Only visible with EMPLOYEE_DELETE permission
                                    </Typography>
                                </Alert>
                            </PermissionGuard>

                            {/* Multiple permissions - all required */}
                            <PermissionGuard permissions={['EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE']}>
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        ✅ Management Area - Requires EMPLOYEE_CREATE AND EMPLOYEE_UPDATE
                                    </Typography>
                                </Alert>
                            </PermissionGuard>

                            {/* Multiple permissions - any required */}
                            <PermissionGuard 
                                permissions={['EMPLOYEE_GET', 'CUSTOMER_GET']} 
                                requireAll={false}
                            >
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        📊 Dashboard Access - Requires EMPLOYEE_GET OR CUSTOMER_GET
                                    </Typography>
                                </Alert>
                            </PermissionGuard>

                            {/* With fallback */}
                            <PermissionGuard 
                                permission="ACCESS_GROUP_GET"
                                fallback={
                                    <Alert severity="error">
                                        <Typography variant="body2">
                                            ❌ No access to admin panel
                                        </Typography>
                                    </Alert>
                                }
                            >
                                <Alert severity="success">
                                    <Typography variant="body2">
                                        🔐 Admin Panel Access Granted
                                    </Typography>
                                </Alert>
                            </PermissionGuard>

                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="caption">
                                    <strong>Code:</strong><br />
                                    {`<PermissionGuard permission="EMPLOYEE_DELETE">
    <DangerZone />
</PermissionGuard>`}
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Example 3: usePermission Hook */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                3. usePermission Hook
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Programmatic permission checking
                            </Typography>

                            <Box display="flex" flexDirection="column" gap={1}>
                                <Typography variant="body2">
                                    Can create employee: <strong>{can('EMPLOYEE_CREATE') ? '✅ Yes' : '❌ No'}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Can update employee: <strong>{can('EMPLOYEE_UPDATE') ? '✅ Yes' : '❌ No'}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Can delete employee: <strong>{can('EMPLOYEE_DELETE') ? '✅ Yes' : '❌ No'}</strong>
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body2">
                                    Can manage employees (any): <strong>{canAny(['EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_DELETE']) ? '✅ Yes' : '❌ No'}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Can fully manage (all): <strong>{canAll(['EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_DELETE']) ? '✅ Yes' : '❌ No'}</strong>
                                </Typography>
                            </Box>

                            <Box mt={2}>
                                {can('EMPLOYEE_CREATE') && (
                                    <Typography color="success.main" variant="body2">
                                        ✅ You can create employees
                                    </Typography>
                                )}
                                {!can('EMPLOYEE_DELETE') && (
                                    <Typography color="error.main" variant="body2">
                                        ❌ You cannot delete employees
                                    </Typography>
                                )}
                            </Box>

                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="caption">
                                    <strong>Code:</strong><br />
                                    {`const { can, canAny, canAll } = usePermission();

if (can('EMPLOYEE_CREATE')) {
    // Show create button
}

if (canAny(['PERM1', 'PERM2'])) {
    // Show if has any permission
}`}
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Example 4: Action Buttons in Table */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                4. Action Buttons (Table Pattern)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Common pattern for table rows
                            </Typography>

                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography>John Doe - Employee</Typography>
                                    <Box display="flex" gap={1}>
                                        <PermissionGuard permission="EMPLOYEE_GET">
                                            <Tooltip title="View">
                                                <IconButton size="small" color="info">
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </PermissionGuard>

                                        <PermissionGuard permission="EMPLOYEE_UPDATE">
                                            <Tooltip title="Edit">
                                                <IconButton size="small" color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </PermissionGuard>

                                        <PermissionGuard permission="EMPLOYEE_DELETE">
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </PermissionGuard>
                                    </Box>
                                </Box>
                            </Paper>

                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="caption">
                                    <strong>Code:</strong><br />
                                    {`<PermissionGuard permission="EMPLOYEE_UPDATE">
    <IconButton onClick={() => handleEdit(item.id)}>
        <EditIcon />
    </IconButton>
</PermissionGuard>`}
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Example 5: Toolbar with Multiple Actions */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                5. Toolbar with Multiple Actions
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Typical page toolbar pattern
                            </Typography>

                            <Box display="flex" gap={2} flexWrap="wrap">
                                <AppButton
                                    label="Create"
                                    permission="EMPLOYEE_CREATE"
                                    hideIfNoPermission={true}
                                    startIcon={<AddIcon />}
                                    onClick={() => alert('Create')}
                                />

                                <AppButton
                                    label="Import"
                                    permission="EMPLOYEE_IMPORT"
                                    hideIfNoPermission={true}
                                    startIcon={<UploadIcon />}
                                    onClick={() => alert('Import')}
                                />

                                <AppButton
                                    label="Export"
                                    permissions={['EMPLOYEE_GET', 'EMPLOYEE_EXPORT']}
                                    requireAll={false}
                                    hideIfNoPermission={true}
                                    startIcon={<DownloadIcon />}
                                    onClick={() => alert('Export')}
                                    variant="outlined"
                                />

                                {/* Show only for super admin */}
                                {isSuperAdmin() && (
                                    <AppButton
                                        label="Advanced Settings"
                                        onClick={() => alert('Settings')}
                                        variant="outlined"
                                        color="error"
                                    />
                                )}
                            </Box>

                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="caption">
                                    <strong>Best Practice:</strong> Use hideIfNoPermission={'{'}true{'}'} for toolbar actions to keep UI clean
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Example 6: Complex Conditional Rendering */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                6. Complex Permission Logic
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Combining multiple permission checks
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    {canAll(['EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_DELETE']) ? (
                                        <Alert severity="success">
                                            <Typography variant="body2">
                                                ✅ <strong>Full Management Access</strong><br />
                                                You can create, update, and delete employees
                                            </Typography>
                                        </Alert>
                                    ) : canAny(['EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_DELETE']) ? (
                                        <Alert severity="warning">
                                            <Typography variant="body2">
                                                ⚠️ <strong>Partial Access</strong><br />
                                                You have some employee management permissions
                                            </Typography>
                                        </Alert>
                                    ) : (
                                        <Alert severity="error">
                                            <Typography variant="body2">
                                                ❌ <strong>No Management Access</strong><br />
                                                You cannot manage employees
                                            </Typography>
                                        </Alert>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    {isSuperAdmin() ? (
                                        <Alert severity="info">
                                            <Typography variant="body2">
                                                👑 <strong>Super Admin</strong><br />
                                                You have access to everything
                                            </Typography>
                                        </Alert>
                                    ) : canAny(['ACCESS_GROUP_GET', 'USER_GET']) ? (
                                        <Alert severity="info">
                                            <Typography variant="body2">
                                                🔐 <strong>Admin Access</strong><br />
                                                You have some admin permissions
                                            </Typography>
                                        </Alert>
                                    ) : (
                                        <Alert severity="info">
                                            <Typography variant="body2">
                                                👤 <strong>Regular User</strong><br />
                                                Standard access level
                                            </Typography>
                                        </Alert>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Alert severity="info">
                                        <Typography variant="body2">
                                            <strong>Your Access Summary:</strong><br />
                                            • Employees: {can('EMPLOYEE_GET') ? '✅' : '❌'}<br />
                                            • Customers: {can('CUSTOMER_GET') ? '✅' : '❌'}<br />
                                            • Areas: {can('AREA_GET') ? '✅' : '❌'}<br />
                                            • Access Control: {can('ACCESS_GROUP_GET') ? '✅' : '❌'}
                                        </Typography>
                                    </Alert>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Implementation Tips */}
            <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" gutterBottom>
                    💡 Implementation Tips
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" paragraph>
                            <strong>1. Use hideIfNoPermission for toolbars</strong><br />
                            Keeps UI clean by hiding unavailable actions
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>2. Use disabled (default) for important actions</strong><br />
                            Shows user the action exists but they can't use it
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>3. Protect routes first</strong><br />
                            Always use ProtectedRoute before implementing UI checks
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" paragraph>
                            <strong>4. Check permissions before API calls</strong><br />
                            Verify permissions in your handlers for extra security
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>5. Use PermissionGuard for sections</strong><br />
                            Conditionally render entire UI sections
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>6. Super Admin bypass is automatic</strong><br />
                            No need to check separately - built into hasPermission()
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default PermissionExample;
