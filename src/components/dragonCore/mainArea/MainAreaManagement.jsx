import {
    Box,
    Typography,
    Alert,
    Snackbar,
    MenuItem,
    Menu,
} from '@mui/material';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import useAreaAndDpManagement from '../../../hooks/useAreaAndDpManagement';
import MainAreaList from './MainAreaList';
import SubAreaList from './SubAreaList';
import DpList from './DistribuationPorts/DpList.jsx';
import MapView from './MapView';
import MainAreaDialog from './MainAreaDialog';
import SubAreaDialog from './SubAreaDialog';
import DeleteDialog from './DeleteDialog';
import CreateDistributionPort from "./DistribuationPorts/CreateDistributionPort.jsx";

const MainAreaManagement = () => {
    const {
        mainAreas,
        filteredMainAreas,
        subAreas,
        filteredSubAreas,
        dpPorts,
        filteredDps,
        selectedMainArea,
        selectedSubArea,
        selectedDp,
        loading,
        subAreaLoading,
        dpLoading,
        openDialog,
        openSubAreaDialog,
        openDpDialog,
        editMode,
        subAreaEditMode,
        dpEditMode,
        currentArea,
        currentSubArea,
        currentDp,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        mainAreaSearch,
        setMainAreaSearch,
        subAreaSearch,
        setSubAreaSearch,
        dpSearch,
        setDpSearch,
        boundingBoxCoords,
        subAreaBoundingBoxCoords,
        formData,
        subAreaFormData,
        openDeleteDialog,
        itemToDelete,
        deleteType,
        mapCenter,
        dialogMapCenter,
        markers,
        isLoaded,
        handleMainAreaClick,
        handleSubAreaClick,
        handleDpClick,
        handleMapClick,
        handleSubAreaMapClick,
        handleRemoveCoord,
        handleRemoveSubAreaCoord,
        handleOpenDialog,
        handleCloseDialog,
        handleOpenSubAreaDialog,
        handleCloseSubAreaDialog,
        handleOpenDpDialog,
        handleCloseDpDialog,
        handleInputChange,
        handleSubAreaInputChange,
        handleSubmit,
        handleSubAreaSubmit,
        handleDpSuccess,
        handleDpError,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        anchorEl,
        selectedArea,
        handleMenuOpen,
        handleMenuClose,
        handleEdit,
        subAreaAnchorEl,
        selectedSubAreaForMenu,
        handleSubAreaMenuOpen,
        handleSubAreaMenuClose,
        handleSubAreaEdit,
        dpAnchorEl,
        selectedDpForMenu,
        handleDpMenuOpen,
        handleDpMenuClose,
        handleDpEdit
    } = useAreaAndDpManagement();

    return (
        <Box sx={{ p: 1 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600} color="text.primary">
                        Area Management
                    </Typography>
                </Box>
            </Box>

            {/* Success/Error Messages */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* Main Content Section */}
            <Box height="80vh" display="flex" justifyContent="center">
                <MainAreaList
                    loading={loading}
                    mainAreas={mainAreas}
                    filteredMainAreas={filteredMainAreas}
                    selectedMainArea={selectedMainArea}
                    mainAreaSearch={mainAreaSearch}
                    setMainAreaSearch={setMainAreaSearch}
                    handleMainAreaClick={handleMainAreaClick}
                    handleMenuOpen={handleMenuOpen}
                    handleOpenDialog={handleOpenDialog}
                />

                <SubAreaList
                    subAreaLoading={subAreaLoading}
                    filteredSubAreas={filteredSubAreas}
                    selectedMainArea={selectedMainArea}
                    selectedSubArea={selectedSubArea}
                    subAreaSearch={subAreaSearch}
                    setSubAreaSearch={setSubAreaSearch}
                    handleSubAreaClick={handleSubAreaClick}
                    handleOpenSubAreaDialog={handleOpenSubAreaDialog}
                    handleSubAreaMenuOpen={handleSubAreaMenuOpen}
                />

                <DpList
                    dpLoading={dpLoading}
                    filteredDps={filteredDps}
                    selectedSubArea={selectedSubArea}
                    selectedDp={selectedDp}
                    dpSearch={dpSearch}
                    setDpSearch={setDpSearch}
                    handleDpClick={handleDpClick}
                    handleDpMenuOpen={handleDpMenuOpen}
                    handleOpenDpDialog={handleOpenDpDialog}
                />

                <MapView
                    isLoaded={isLoaded}
                    mapCenter={mapCenter}
                    markers={markers}
                    selectedMainArea={selectedMainArea}
                    selectedSubArea={selectedSubArea}
                    selectedDp={selectedDp}
                    subAreas={filteredSubAreas}
                    dpPorts={filteredDps}
                    handleOpenDpDialog={handleOpenDpDialog}
                    subAreaBoundingBoxCoords={subAreaBoundingBoxCoords}
                    openSubAreaDialog={openSubAreaDialog}
                />
            </Box>

            {/* Main Area Popup Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleEdit}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog(selectedArea, 'main')}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            {/* Sub Area Popup Menu */}
            <Menu
                anchorEl={subAreaAnchorEl}
                open={Boolean(subAreaAnchorEl)}
                onClose={handleSubAreaMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleSubAreaEdit}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog(selectedSubAreaForMenu, 'sub')}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            {/* DP Popup Menu */}
            <Menu
                anchorEl={dpAnchorEl}
                open={Boolean(dpAnchorEl)}
                onClose={handleDpMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleDpEdit}>
                    <FiEdit2 style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog(selectedDpForMenu, 'dp')}>
                    <FiTrash2 style={{ marginRight: 8, color: '#f44336' }} /> Delete
                </MenuItem>
            </Menu>

            <DeleteDialog
                open={openDeleteDialog}
                itemToDelete={itemToDelete}
                deleteType={deleteType}
                loading={loading || subAreaLoading || dpLoading}
                handleClose={handleCloseDeleteDialog}
                handleConfirm={handleConfirmDelete}
            />

            <MainAreaDialog
                open={openDialog}
                editMode={editMode}
                formData={formData}
                loading={loading}
                isLoaded={isLoaded}
                dialogMapCenter={dialogMapCenter}
                boundingBoxCoords={boundingBoxCoords}
                handleClose={handleCloseDialog}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                handleMapClick={handleMapClick}
                handleRemoveCoord={handleRemoveCoord}
            />

            <SubAreaDialog
                open={openSubAreaDialog}
                editMode={subAreaEditMode}
                formData={subAreaFormData}
                loading={subAreaLoading}
                isLoaded={isLoaded}
                dialogMapCenter={dialogMapCenter}
                boundingBoxCoords={subAreaBoundingBoxCoords}
                handleClose={handleCloseSubAreaDialog}
                handleSubmit={handleSubAreaSubmit}
                handleInputChange={handleSubAreaInputChange}
                handleMapClick={handleSubAreaMapClick}
                handleRemoveCoord={handleRemoveSubAreaCoord}
                selectedMainArea={selectedMainArea}
            />
            
            <CreateDistributionPort
                open={openDpDialog}
                onClose={handleCloseDpDialog}
                editMode={dpEditMode}
                currentDp={currentDp}
                onSuccess={handleDpSuccess}
                onError={handleDpError}
                isLoaded={isLoaded}
                selectedSubArea={selectedSubArea}
                selectedMainArea={selectedMainArea}
            />
        </Box>
    );
};

export default MainAreaManagement;
