import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  MenuItem,
  Menu,
} from "@mui/material";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import useOfficeLocations from "../../../hooks/useOfficeLocations";
import OfficeList from "./OfficeList";
import OfficeMapView from "./OfficeMapView";
import OfficeDialog from "./OfficeDialog";
import DeleteDialog from "./DeleteDialog";
import AppButton from "../../../common/AppButton.jsx";
import { ApiUrls } from "../../../services/DragonApi.js";

const OfficeLocations = () => {
  // API se aane wale roles ke liye state
  const [apiOfficeRoles, setApiOfficeRoles] = useState([]);

  const {
    offices,
    filteredOffices,
    officeTypes,
    selectedOffice,
    loading,
    openOfficeDialog,
    officeEditMode,
    successMessage,
    errorMessage,
    setSuccessMessage,
    setErrorMessage,
    officeSearch,
    setOfficeSearch,
    mapCenter,
    markerPosition,
    dialogMapCenter,
    dialogMarker,
    officeFormData,
    setOfficeFormData,
    openDeleteDialog,
    officeToDelete,
    officeAnchorEl,
    selectedOfficeForMenu,
    isLoaded,
    handleOfficeClick,
    handleOpenOfficeDialog,
    handleCloseOfficeDialog,
    handleOfficeInputChange,
    handleDialogMapClick,
    handleOfficeSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    handleOfficeMenuOpen,
    handleOfficeMenuClose,
    handleOfficeEdit,
    handleCopyOfficeDetails,
    setDialogMapCenter,
    setDialogMarker,
    officeRoles,
  } = useOfficeLocations();

  return (
    <Box sx={{ p: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Office Locations
        </Typography>
        <AppButton
          variant="contained"
          startIcon={<FiPlus />}
          onClick={() => handleOpenOfficeDialog()}
          disabled={loading}
          label={"Add Office Location"}
        />
      </Box>

      {/* Snackbar Messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Box
        height="75vh"
        display="flex"
        borderRadius={3}
        bgcolor="#1E293B"
        overflow="hidden"
      >
        <OfficeList
          loading={loading}
          offices={offices}
          filteredOffices={filteredOffices}
          selectedOffice={selectedOffice}
          officeSearch={officeSearch}
          setOfficeSearch={setOfficeSearch}
          handleOfficeClick={handleOfficeClick}
          handleOfficeMenuOpen={handleOfficeMenuOpen}
        />

        <OfficeMapView
          isLoaded={isLoaded}
          mapCenter={mapCenter}
          markerPosition={markerPosition}
          selectedOffice={selectedOffice}
          handleCopyOfficeDetails={handleCopyOfficeDetails}
        />
      </Box>

      <Menu
        anchorEl={officeAnchorEl}
        open={Boolean(officeAnchorEl)}
        onClose={handleOfficeMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleOfficeEdit}>
          <FiEdit2 style={{ marginRight: 8 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleOpenDeleteDialog(selectedOfficeForMenu)}>
          <FiTrash2 style={{ marginRight: 8, color: "#f44336" }} /> Delete
        </MenuItem>
      </Menu>

      <DeleteDialog
        open={openDeleteDialog}
        itemToDelete={officeToDelete}
        loading={loading}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleConfirmDelete}
      />

      <OfficeDialog
        open={openOfficeDialog}
        editMode={officeEditMode}
        formData={officeFormData}
        loading={loading}
        isLoaded={isLoaded}
        officeTypes={officeTypes}
        officeRoles={officeRoles}
        dialogMapCenter={dialogMapCenter}
        dialogMarker={dialogMarker}
        handleClose={handleCloseOfficeDialog}
        handleSubmit={handleOfficeSubmit}
        handleInputChange={handleOfficeInputChange}
        handleDialogMapClick={handleDialogMapClick}
        setFormData={setOfficeFormData}
        setDialogMapCenter={setDialogMapCenter}
        setDialogMarker={setDialogMarker}
      />
    </Box>
  );
};

export default OfficeLocations;
