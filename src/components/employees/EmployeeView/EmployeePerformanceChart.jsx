import React, { useState, useEffect, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    Chip,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import employeeService from "../../../services/employeeService.js";

// ─── Stat Badge ───────────────────────────────────────────────────────────────
const StatBadge = ({ icon, label, value, color }) => (
    <Box sx={{
        display: "flex", alignItems: "center", gap: 1.5,
        background: `${color}18`,
        border: `1px solid ${color}35`,
        borderRadius: 2.5, px: 2.5, py: 1.5,
        flex: 1, minWidth: 140,
        transition: "transform 0.15s",
        "&:hover": { transform: "translateY(-2px)" },
    }}>
        <Box sx={{ color, display: "flex", p: 0.8, background: `${color}20`, borderRadius: 1.5 }}>
            {icon}
        </Box>
        <Box>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.7rem", lineHeight: 1, mb: 0.4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
            </Typography>
            <Typography sx={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1.5rem", lineHeight: 1 }}>
                {value}
            </Typography>
        </Box>
    </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const EmployeePerformanceChart = ({ employeeData }) => {
    const employeeId = employeeData?.id;

    const [period, setPeriod]   = useState("MONTHLY");
    const [report, setReport]   = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const fetchReport = useCallback(async () => {
        if (!employeeId) return;
        setLoading(true);
        setError(null);
        try {
            const res  = await employeeService.getPerformanceReport(employeeId, period);
            const data = res?.data ?? res;
            setReport(data);
        } catch {
            setError("Failed to load performance data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [employeeId, period]);

    useEffect(() => { fetchReport(); }, [fetchReport]);

    const chartData  = report?.data ?? [];
    const labels     = chartData.map((d) => d.label);
    const tickets    = chartData.map((d) => d.ticketsResolved);
    const tasks      = chartData.map((d) => d.tasksCompleted);

    const periodLabels = { DAILY: "Last 7 Days", WEEKLY: "Last 4 Weeks", MONTHLY: "Last 12 Months" };

    // ── ApexCharts options ──────────────────────────────────────────────────
    const chartOptions = {
        chart: {
            type: "bar",
            background: "transparent",
            toolbar: { show: false },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 600,
            },
        },
        theme: { mode: "dark" },
        colors: ["#6366f1", "#10b981"],
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: "55%",
                dataLabels: { position: "top" },
            },
        },
        dataLabels: {
            enabled: true,
            style: { fontSize: "11px", colors: ["#94a3b8"] },
            offsetY: -18,
            formatter: (val) => (val > 0 ? val : ""),
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
        },
        xaxis: {
            categories: labels,
            labels: {
                style: { colors: "#64748b", fontSize: "11px" },
                rotate: -30,
                rotateAlways: period === "MONTHLY",
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: "#64748b", fontSize: "11px" },
                formatter: (val) => Math.floor(val),
            },
        },
        grid: {
            borderColor: "rgba(255,255,255,0.06)",
            strokeDashArray: 4,
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
            labels: { colors: "#94a3b8" },
            markers: { width: 10, height: 10, radius: 5 },
        },
        tooltip: {
            theme: "dark",
            y: { formatter: (val) => `${val} closed` },
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "vertical",
                shadeIntensity: 0.4,
                gradientToColors: ["#818cf8", "#34d399"],
                inverseColors: false,
                opacityFrom: 0.9,
                opacityTo: 0.5,
                stops: [0, 100],
            },
        },
        states: {
            hover: { filter: { type: "lighten", value: 0.1 } },
            active: { filter: { type: "darken", value: 0.1 } },
        },
    };

    const series = [
        { name: "Tickets Resolved", data: tickets },
        { name: "Tasks Completed",  data: tasks  },
    ];

    return (
        <Box sx={{
            background: "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: 3,
            p: 3,
            border: "1px solid rgba(99,102,241,0.18)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
        }}>
            {/* Header row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 2.5 }}>
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
                        <Box sx={{ p: 0.6, background: "rgba(99,102,241,0.2)", borderRadius: 1.5, display: "flex" }}>
                            <TrendingUpIcon sx={{ color: "#818cf8", fontSize: 20 }} />
                        </Box>
                        <Typography sx={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1rem" }}>
                            Performance Report
                        </Typography>
                        {report?.employeeName && (
                            <Chip
                                label={report.employeeName}
                                size="small"
                                sx={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: "0.72rem", height: 22 }}
                            />
                        )}
                    </Box>
                    <Typography sx={{ color: "#475569", fontSize: "0.77rem", pl: 0.5 }}>
                        {periodLabels[period]} · Closed tickets & completed tasks
                    </Typography>
                </Box>

                {/* Period switcher */}
                <ToggleButtonGroup
                    value={period}
                    exclusive
                    onChange={(_, v) => v && setPeriod(v)}
                    size="small"
                    sx={{
                        "& .MuiToggleButton-root": {
                            color: "#64748b",
                            border: "1px solid rgba(255,255,255,0.1) !important",
                            fontSize: "0.72rem",
                            px: 1.8, py: 0.5,
                            borderRadius: "8px !important",
                            mx: 0.3,
                            "&.Mui-selected": {
                                background: "rgba(99,102,241,0.25)",
                                color: "#a5b4fc",
                                borderColor: "rgba(99,102,241,0.4) !important",
                            },
                            "&:hover": {
                                background: "rgba(255,255,255,0.05)",
                            },
                        },
                    }}
                >
                    <ToggleButton value="DAILY">Daily</ToggleButton>
                    <ToggleButton value="WEEKLY">Weekly</ToggleButton>
                    <ToggleButton value="MONTHLY">Monthly</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Stat badges */}
            <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
                <StatBadge
                    icon={<ConfirmationNumberIcon sx={{ fontSize: 18 }} />}
                    label="Tickets Resolved"
                    value={loading ? "—" : (report?.totalTicketsResolved ?? 0)}
                    color="#6366f1"
                />
                <StatBadge
                    icon={<TaskAltIcon sx={{ fontSize: 18 }} />}
                    label="Tasks Completed"
                    value={loading ? "—" : (report?.totalTasksCompleted ?? 0)}
                    color="#10b981"
                />
                <StatBadge
                    icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
                    label="Total Closed"
                    value={loading ? "—" : ((report?.totalTicketsResolved ?? 0) + (report?.totalTasksCompleted ?? 0))}
                    color="#f59e0b"
                />
            </Box>

            {/* Chart body */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 280 }}>
                    <CircularProgress sx={{ color: "#6366f1" }} />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
            ) : chartData.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 280 }}>
                    <Typography sx={{ color: "#475569" }}>No activity data for this period.</Typography>
                </Box>
            ) : (
                <ReactApexChart
                    options={chartOptions}
                    series={series}
                    type="bar"
                    height={300}
                />
            )}
        </Box>
    );
};

export default EmployeePerformanceChart;
