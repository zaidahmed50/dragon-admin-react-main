import { DataGrid } from "@mui/x-data-grid";
import {
    Button,
    TextField,
    IconButton,
    Box,
    Typography,
    Select,
    MenuItem,
    Menu,
    Checkbox,
    FormControlLabel,
    FormGroup,
    CircularProgress,
    Alert,
    useTheme,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FiColumns, FiFilter } from "react-icons/fi";
import PermissionGuard from "../components/PermissionGuard";

const AppDataGrid = ({
                         rows,
                         columns: initialColumns,
                         loading,
                         error,
                         totalRecords,
                         totalPages,
                         pageSize,
                         currentPage,
                         handlePageSizeChange,
                         handlePreviousPage,
                         handleNextPage,
                         handlePageClick,
                         toolbarProps,
                         columnManager,
                         onRowClick,
                         getRowId,
                         onRefresh,
                         pagination = true, // Default to true
                     }) => {
    const theme = useTheme();

    const {
        columns,
        anchorEl,
        columnVisibility,
        handleColumnResize,
        handleColumnVisibilityChange,
        handleColumnMenuOpen,
        handleColumnMenuClose,
    } = columnManager;

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 0; i < totalPages; i++) pages.push(i);
        } else if (currentPage <= 2) {
            pages.push(0, 1, 2, 3, "...", totalPages - 1);
        } else if (currentPage >= totalPages - 3) {
            pages.push(0, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
        } else {
            pages.push(
                0,
                "...",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "...",
                totalPages - 1
            );
        }

        return pages;
    };

    return (
        <Box sx={{ p: 2, backgroundColor: "background.default" }}>
            {/* MAIN CONTAINER */}
            <Box
                sx={{
                    height: "75vh",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: 1,
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                }}
            >
                {/* ===== HEADER / TOOLBAR (FIXED) ===== */}
                {toolbarProps && (
                    <Box
                        sx={{
                            flexShrink: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="h6">{toolbarProps.title}</Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                size="small"
                                value={toolbarProps.searchQuery}
                                onChange={toolbarProps.onSearchChange}
                                placeholder={toolbarProps.searchPlaceholder}
                            />

                            {toolbarProps.onCreate && (
                                <PermissionGuard 
                                    permission={toolbarProps.createPermission}
                                >
                                    <Button variant="contained" onClick={toolbarProps.onCreate}>
                                        {toolbarProps.createLabel}
                                    </Button>
                                </PermissionGuard>
                            )}

                            {toolbarProps.extraActions}

                            <IconButton
                                onClick={handleColumnMenuOpen}
                                sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.main" } }}
                            >
                                <FiColumns color="white" />
                            </IconButton>

                            {toolbarProps.onFilterDialogOpen && (
                                <IconButton
                                    onClick={toolbarProps.onFilterDialogOpen}
                                    sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.main" } }}
                                >
                                    <FiFilter color="white" />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                )}

                {error && <Alert severity="error">{error}</Alert>}

                {/* ===== SCROLLABLE CONTENT ===== */}
                <Box
                    sx={{
                        flex: 1,
                        position: "relative",
                        overflow: "auto",
                    }}
                >
                    {loading && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor:
                                    theme.palette.mode === "dark"
                                        ? "rgba(15,23,42,0.6)"
                                        : "rgba(255,255,255,0.6)",
                                zIndex: 1,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={getRowId}
                        hideFooter
                        rowHeight={30}
                        headerHeight={30}
                        onRowClick={onRowClick}
                        onColumnWidthChange={handleColumnResize}
                        // getRowClassName={(params) =>
                        //     params.indexRelativeToCurrentPage % 2 === 0
                        //         ? 'even-row'
                        //         : 'odd-row'
                        // }
                        sx={{
                            height: "100%",
                            border: "none",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor:
                                    theme.palette.mode === "dark" ? "#0f172a" : "#f9f9f9",
                                borderBottom: 1,
                                borderColor: "divider",
                            },
                            "& .MuiDataGrid-row:nth-of-type(odd)": {
                                backgroundColor:
                                    theme.palette.mode === "dark" ? "#1a2332" : "#fcfcfc",
                            },

                            "& .MuiDataGrid-row": {
                                borderBottom: "1px solid",
                                borderColor: "divider",
                            },
                        }}
                    />
                </Box>

                {/* ===== FOOTER / PAGINATION (FIXED) ===== */}
                {pagination && (
                    <Box
                        sx={{
                            flexShrink: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 2,
                            py: 1,
                            borderTop: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography fontSize="0.8rem">Rows:</Typography>
                            <Select
                                value={pageSize}
                                size="small"
                                variant="standard"
                                onChange={(e) => handlePageSizeChange(+e.target.value)}
                            >
                                {[5, 10, 20, 50, 100].map((v) => (
                                    <MenuItem key={v} value={v}>
                                        {v}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography fontSize="0.8rem">{`Total ${totalRecords}`}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            {/* Previous */}
                            <IconButton
                                onClick={handlePreviousPage}
                                disabled={currentPage === 0}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    bgcolor: "action.hover",
                                    "&:hover": { bgcolor: "action.selected" },
                                }}
                            >
                                <ArrowBackIosIcon sx={{ fontSize: "0.7rem" }} />
                            </IconButton>

                            {/* Page Numbers */}
                            {getPageNumbers().map((p, i) =>
                                p === "..." ? (
                                    <Typography
                                        key={i}
                                        sx={{ fontSize: "0.75rem", mx: 0.5, color: "text.secondary" }}
                                    >
                                        ...
                                    </Typography>
                                ) : (
                                    <Box
                                        key={p}
                                        onClick={() => handlePageClick(p)}
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            fontSize: "0.75rem",
                                            fontWeight: 500,
                                            bgcolor: p === currentPage ? "primary.main" : "transparent",
                                            color: p === currentPage ? "#fff" : "text.secondary",
                                            border: p === currentPage ? "none" : "1px solid",
                                            borderColor: "divider",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                bgcolor: p === currentPage ? "primary.dark" : "action.hover",
                                            },
                                        }}
                                    >
                                        {p + 1}
                                    </Box>
                                )
                            )}

                            {/* Next */}
                            <IconButton
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages - 1}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    bgcolor: "action.hover",
                                    "&:hover": { bgcolor: "action.selected" },
                                }}
                            >
                                <ArrowForwardIosIcon sx={{ fontSize: "0.7rem" }} />
                            </IconButton>
                        </Box>

                        <Button variant="contained" onClick={onRefresh}>
                            Refresh
                        </Button>
                    </Box>
                )}
            </Box>

            {/* ===== COLUMN MENU ===== */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleColumnMenuClose}>
                <Box sx={{ p: 2 }}>
                    <Typography fontWeight="bold">Show / Hide Columns</Typography>
                    <FormGroup>
                        {initialColumns.map((col) => (
                            <FormControlLabel
                                key={col.field}
                                control={
                                    <Checkbox
                                        checked={columnVisibility[col.field]}
                                        onChange={() => handleColumnVisibilityChange(col.field)}
                                    />
                                }
                                label={col.headerName}
                            />
                        ))}
                    </FormGroup>
                </Box>
            </Menu>
        </Box>
    );
};

export default AppDataGrid;
