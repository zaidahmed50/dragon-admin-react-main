import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  ArrowUpRight, BatteryMedium, ChevronDown, ChevronUp,
  Clock3, Gauge, Layers3, Loader2, LocateFixed, MapPin,
  Navigation, Plus, RefreshCw, Search, ShieldAlert, Smartphone,
  Wifi, WifiOff, X,
} from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import '../../styles/tracking.css';
import { trackingService, trackingDeviceService } from '../../services/trackingService';
import { useTrackingDevicesQuery } from '../../hooks/useTrackingDevices';
import { useDeviceStatusMqtt, useDeviceStatusStore } from '../../hooks/useDeviceStatus';
import { onLiveLocation } from '../../services/mqttClient';
import { cn } from '../../lib/utils';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makePin(color, initials, selected) {
  return new L.DivIcon({
    className: 'device-map-marker',
    html: `
      <div class="device-marker ${selected ? 'is-selected' : ''}" style="--marker-color:${color}">
        <div class="device-marker__pulse"></div>
        <div class="device-marker__bubble"><span>${initials}</span></div>
        <div class="device-marker__tail"></div>
      </div>
    `,
    iconSize: [56, 72],
    iconAnchor: [28, 62],
    popupAnchor: [0, -54],
  });
}

function MapRefCapture({ mapRef }) {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map, mapRef]);
  return null;
}

function FitBounds({ locations, mapRef }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current) return;
    const valid = locations.filter((l) => l.point);
    if (valid.length === 0) return;
    if (!mapRef.current) mapRef.current = map;
    if (valid.length === 1) {
      map.setView([valid[0].point.latitude, valid[0].point.longitude], 15);
    } else {
      const bounds = L.latLngBounds(valid.map((l) => [l.point.latitude, l.point.longitude]));
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 14 });
    }
    fitted.current = true;
  }, [locations, map, mapRef]);
  return null;
}

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!response.ok) throw new Error('Geocode failed');
  const json = await response.json();
  return json.display_name ?? 'Unknown address';
}

function getDeviceLabel(device) {
  return device.deviceName || `Device ${device.deviceUuid?.slice(0, 8)}`;
}

function getDeviceSubtitle() {
  return 'Tracked device';
}

function formatTimestamp(value) {
  if (!value) return 'No recent update';
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function formatTimeAgo(value) {
  if (!value) return 'No update';
  const diffMs = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'Just now';
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function formatSpeed(speed) {
  if (!speed || speed <= 0) return 'Stationary';
  return speed >= 10 ? `${speed.toFixed(0)} km/h` : `${speed.toFixed(1)} km/h`;
}

function formatCoords(point) {
  return `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
}

export function AllDevicesMapPage() {
  useDeviceStatusMqtt();

  const deviceStatuses = useDeviceStatusStore((state) => state.statuses);
  const setDeviceStatus = useDeviceStatusStore((state) => state.setStatus);
  const { data: devices = [], isLoading: devicesLoading, refetch: refetchDevices } = useTrackingDevicesQuery();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [search, setSearch] = useState('');
  const [panelView, setPanelView] = useState('all');
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(false);
  const [addresses, setAddresses] = useState({});
  const [addressLoading, setAddressLoading] = useState({});
  const mapRef = useRef(null);

  const [liveLocations, setLiveLocations] = useState({});

  useEffect(() => {
    const unsub = onLiveLocation(({ deviceUuid, points }) => {
      if (points.length === 0) return;
      const latest = points[points.length - 1];
      if (latest.latitude == null || latest.longitude == null) return;
      setLiveLocations((prev) => ({ ...prev, [deviceUuid]: latest }));
    });
    return unsub;
  }, []);

  const [registerModal, setRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({ deviceUuid: '', deviceName: '' });
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(null);

  useEffect(() => {
    if (!devicesLoading && devices.length === 0) {
      setLocations([]);
      setLoading(false);
    }
  }, [devices, devicesLoading]);

  useEffect(() => {
    if (devicesLoading) return;
    if (devices.length === 0) return;

    let cancelled = false;
    setLoading(true);
    setAddresses({});

    Promise.allSettled(
      devices.map((device) =>
        trackingService
          .getHistory(device.deviceUuid, { page: 0, size: 1 })
          .then((response) => {
            const content = response?.data?.content ?? response?.content ?? [];
            return { device, point: content[0] ?? null, error: false };
          })
          .catch(() => ({ device, point: null, error: true }))
      )
    ).then((results) => {
      if (cancelled) return;
      setLocations(
        results.map((result, index) =>
          result.status === 'fulfilled'
            ? result.value
            : { device: devices[index], point: null, error: true }
        )
      );
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [devices, devicesLoading, refreshKey]);

  const handleDeviceFocus = useCallback((location, collapseMobileSheet = false) => {
    if (!location.point || !mapRef.current) return;
    setSelectedUuid(location.device.deviceUuid);
    const live = liveLocations[location.device.deviceUuid];
    const target = live ?? location.point;
    mapRef.current.flyTo([target.latitude, target.longitude], 16, { duration: 1.2 });
    if (collapseMobileSheet) setMobileSheetExpanded(false);
  }, [liveLocations]);

  const handleShowAddress = useCallback(async (event, uuid, lat, lng) => {
    event.stopPropagation();
    if (addresses[uuid] || addressLoading[uuid]) return;
    setAddressLoading((cur) => ({ ...cur, [uuid]: true }));
    try {
      const address = await reverseGeocode(lat, lng);
      setAddresses((cur) => ({ ...cur, [uuid]: address }));
    } catch {
      setAddresses((cur) => ({ ...cur, [uuid]: 'Could not fetch address' }));
    } finally {
      setAddressLoading((cur) => ({ ...cur, [uuid]: false }));
    }
  }, [addresses, addressLoading]);

  const handleOpenTracking = useCallback((deviceUuid) => {
    window.open(`/tracking/device/${deviceUuid}`, '_blank', 'noopener,noreferrer');
  }, []);

  const handleRefresh = useCallback(() => setRefreshKey((v) => v + 1), []);

  const openRegisterModal = useCallback(() => {
    setRegisterForm({ deviceUuid: '', deviceName: '' });
    setRegisterError(null);
    setRegisterSuccess(null);
    setRegisterModal(true);
  }, []);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    if (!registerForm.deviceUuid.trim()) {
      setRegisterError('Device UUID is required.');
      return;
    }
    setRegistering(true);
    setRegisterError(null);
    setRegisterSuccess(null);
    try {
      const res = await trackingDeviceService.registerDevice({
        deviceUuid: registerForm.deviceUuid.trim(),
        deviceName: registerForm.deviceName.trim() || null,
      });
      const msg = res?.data?.message ?? res?.message ?? 'Device registered successfully.';
      setRegisterSuccess(msg);
      refetchDevices();
      setTimeout(() => setRegisterModal(false), 1400);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Registration failed.';
      setRegisterError(msg);
    } finally {
      setRegistering(false);
    }
  }, [registerForm, refetchDevices]);

  const q = search.trim().toLowerCase();
  const located = useMemo(() => locations.filter((l) => l.point), [locations]);
  const noLocation = useMemo(() => locations.filter((l) => !l.point), [locations]);

  const filteredLocated = useMemo(() => {
    if (!q) return located;
    return located.filter((l) => getDeviceLabel(l.device).toLowerCase().includes(q));
  }, [located, q]);

  const filteredNoLocation = useMemo(() => {
    if (!q) return noLocation;
    return noLocation.filter((l) => getDeviceLabel(l.device).toLowerCase().includes(q));
  }, [noLocation, q]);

  const onlineCount = useMemo(
    () => devices.filter((d) => deviceStatuses[d.deviceUuid] === 'online').length,
    [deviceStatuses, devices]
  );
  const visibleResultCount = filteredLocated.length + filteredNoLocation.length;

  const panelFilters = [
    { key: 'all',       label: 'All',        count: visibleResultCount },
    { key: 'located',   label: 'Tracked',    count: filteredLocated.length },
    { key: 'unlocated', label: 'Needs sync', count: filteredNoLocation.length },
  ];

  const showLocatedSection = panelView !== 'unlocated';
  const showNoLocationSection = panelView !== 'located';
  const defaultCenter = [24.8607, 67.0011];

  const renderPanelContent = (isMobile) => (
    <>
      <div className={cn('border-b border-white/10 bg-slate-950', isMobile ? 'px-4 pb-4 pt-2' : 'px-4 pb-4 pt-4')}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
            <p className="truncate text-[0.76rem] text-slate-300">
              {loading ? 'Loading...' : `${located.length} mapped · ${onlineCount} online · ${noLocation.length} waiting`}
            </p>
          </div>
          <button type="button" onClick={openRegisterModal}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-[14px] border border-cyan-400/30 bg-cyan-400/10 px-3 h-8 text-[0.72rem] font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20">
            <Plus className="h-3 w-3" />Register
          </button>
          <button type="button" onClick={handleRefresh} disabled={loading}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-[14px] border border-white/10 bg-white/5 px-3 h-8 text-[0.72rem] font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-60">
            <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />Refresh
          </button>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-sky-200/70">Device Feed</p>
            <h2 className="mt-1 text-base font-semibold text-white sm:text-lg">Browse the device</h2>
            <p className="mt-1 text-xs text-slate-300/70">
              {q ? `${visibleResultCount} matching device${visibleResultCount === 1 ? '' : 's'}` : `${devices.length} managed device${devices.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.72rem] font-medium text-slate-200">
            <Layers3 className="h-3.5 w-3.5 text-sky-200" />{visibleResultCount}
          </div>
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-[18px] border border-white/10 bg-white/5 pl-10 pr-10 text-[0.82rem] text-white outline-none placeholder:text-slate-400 focus:border-sky-400/70" />
          {search && (
            <button type="button" onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Clear search">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {panelFilters.map((filter) => (
            <button key={filter.key} type="button" onClick={() => setPanelView(filter.key)}
              className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-medium transition-all duration-200',
                panelView === filter.key
                  ? 'border-sky-300/40 bg-sky-400/15 text-white'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/15 hover:bg-white/[0.08] hover:text-white')}>
              <span>{filter.label}</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[0.62rem] text-slate-100">{filter.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={cn('flex-1 overflow-y-auto bg-slate-950 px-4 pb-8 pt-4', isMobile && 'px-4 pb-10 pt-3')}>
        {devices.length === 0 && !devicesLoading && (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-300">
              <Smartphone className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">No devices yet</h3>
            <p className="mt-2 text-sm text-slate-400">Register a device to see it here with live status and coordinates.</p>
          </div>
        )}

        <div className={cn('space-y-4', isMobile ? 'space-y-3.5' : 'space-y-4')}>
          {showLocatedSection && filteredLocated.length > 0 && (
            <section className={cn(isMobile ? 'space-y-2' : 'space-y-2.5')}>
              {panelView === 'all' && (
                <div className="flex items-center justify-between px-1">
                  <p className={cn('font-medium uppercase tracking-[0.22em] text-sky-200/70', isMobile ? 'text-[0.64rem]' : 'text-[0.68rem]')}>Tracked Devices</p>
                  <p className={cn('text-slate-400', isMobile ? 'text-[0.64rem]' : 'text-[0.68rem]')}>{filteredLocated.length} with map data</p>
                </div>
              )}

              {filteredLocated.map((location) => {
                const { device, point } = location;
                const effectivePanelPoint = liveLocations[device.deviceUuid] ?? point;
                const isOnline = (deviceStatuses[device.deviceUuid] ?? 'offline') === 'online';
                const isSelected = selectedUuid === device.deviceUuid;
                const address = addresses[device.deviceUuid];
                const pendingAddress = addressLoading[device.deviceUuid];
                const initials = getDeviceLabel(device).slice(0, 2).toUpperCase();

                return (
                  <div key={device.deviceUuid} className={cn('border text-left transition-all duration-300',
                    isMobile ? 'rounded-[18px] p-2.5' : 'rounded-[20px] p-3',
                    isSelected
                      ? 'border-sky-300/35 bg-sky-400/12 shadow-[0_18px_40px_rgba(56,189,248,0.12)]'
                      : 'border-white/10 bg-white/[0.04] hover:border-white/15 hover:bg-white/[0.06]')}>
                    <div className={cn('flex items-start', isMobile ? 'gap-2' : 'gap-2.5')}>
                      <div className={cn('flex shrink-0 items-center justify-center border border-white/10 bg-white/5 font-semibold text-white',
                        isMobile ? 'h-8 w-8 rounded-[14px] text-[0.66rem]' : 'h-9 w-9 rounded-[16px] text-[0.72rem]')}>
                        {initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className={cn('flex items-start justify-between', isMobile ? 'gap-2' : 'gap-2.5')}>
                          <div className="min-w-0">
                            <p className={cn('truncate font-semibold text-white', isMobile ? 'text-[0.74rem]' : 'text-[0.8rem]')}>{getDeviceLabel(device)}</p>
                            <p className={cn('mt-0.5 truncate text-slate-400', isMobile ? 'text-[0.62rem]' : 'text-[0.68rem]')}>{getDeviceSubtitle()}</p>
                          </div>
                          <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full border font-medium',
                            isMobile ? 'px-1.5 py-0.5 text-[0.54rem]' : 'px-1.5 py-0.5 text-[0.58rem]',
                            isOnline ? 'border-emerald-300/25 bg-emerald-400/12 text-emerald-100' : 'border-slate-300/15 bg-slate-200/10 text-slate-200')}>
                            {isOnline ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>

                        <div className={cn('mt-2 flex flex-wrap', isMobile ? 'gap-1' : 'gap-1.5')}>
                          <span className={cn('inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/70 text-slate-200', isMobile ? 'px-1.5 py-0.5 text-[0.54rem]' : 'px-1.5 py-0.5 text-[0.58rem]')}>
                            <Gauge className="h-2.5 w-2.5 text-cyan-200" />{formatSpeed(effectivePanelPoint.speed)}
                          </span>
                          <span className={cn('inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/70 text-slate-200', isMobile ? 'px-1.5 py-0.5 text-[0.54rem]' : 'px-1.5 py-0.5 text-[0.58rem]')}>
                            <Clock3 className="h-2.5 w-2.5 text-slate-300" />{formatTimeAgo(effectivePanelPoint.receivedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={cn('mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2', isMobile && 'sm:grid-cols-1')}>
                      <div className={cn('rounded-[14px] border border-white/8 bg-slate-950/70', isMobile ? 'p-2' : 'p-2.5')}>
                        <p className={cn('uppercase tracking-[0.14em] text-slate-500', isMobile ? 'text-[0.5rem]' : 'text-[0.54rem]')}>Coordinates</p>
                        <p className={cn('mt-1 font-medium text-slate-100', isMobile ? 'text-[0.68rem]' : 'text-[0.72rem]')}>{formatCoords(effectivePanelPoint)}</p>
                      </div>
                      <div className={cn('rounded-[14px] border border-white/8 bg-slate-950/70', isMobile ? 'p-2' : 'p-2.5')}>
                        <p className={cn('uppercase tracking-[0.14em] text-slate-500', isMobile ? 'text-[0.5rem]' : 'text-[0.54rem]')}>Last sync</p>
                        <p className={cn('mt-1 font-medium text-slate-100', isMobile ? 'text-[0.68rem]' : 'text-[0.72rem]')}>{formatTimestamp(effectivePanelPoint.receivedAt)}</p>
                      </div>
                    </div>

                    <div className={cn('mt-2 rounded-[14px] border border-white/8 bg-white/[0.03]', isMobile ? 'px-2 py-1.5' : 'px-2.5 py-2')}>
                      {address ? (
                        <p className={cn('text-slate-300', isMobile ? 'text-[0.58rem] leading-4' : 'text-[0.62rem] leading-4')}>{address}</p>
                      ) : (
                        <button type="button" onClick={(e) => handleShowAddress(e, device.deviceUuid, point.latitude, point.longitude)}
                          disabled={pendingAddress}
                          className={cn('inline-flex items-center font-medium text-sky-200 transition-colors hover:text-white disabled:opacity-60', isMobile ? 'gap-1 text-[0.58rem]' : 'gap-1 text-[0.62rem]')}>
                          {pendingAddress ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Navigation className="h-2.5 w-2.5" />}
                          {pendingAddress ? 'Fetching address...' : 'Show exact address'}
                        </button>
                      )}
                    </div>

                    <div className={cn('mt-2 grid gap-1.5 grid-cols-2')}>
                      <button type="button" onClick={() => handleDeviceFocus(location, isMobile)}
                        className={cn('inline-flex items-center justify-center rounded-[14px] bg-white font-medium text-slate-950 transition-transform duration-200 hover:-translate-y-0.5', isMobile ? 'gap-1 px-2 py-2 text-[0.62rem]' : 'gap-1 px-2.5 py-2 text-[0.68rem]')}>
                        <LocateFixed className="h-3 w-3" />Center on map
                      </button>
                      <button type="button" onClick={() => handleOpenTracking(device.deviceUuid)}
                        className={cn('inline-flex items-center justify-center rounded-[14px] border border-white/10 bg-white/5 font-medium text-white transition-colors hover:bg-white/10', isMobile ? 'gap-1 px-2 py-2 text-[0.62rem]' : 'gap-1 px-2.5 py-2 text-[0.68rem]')}>
                        <ArrowUpRight className="h-3 w-3" />Open tracking
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {showNoLocationSection && filteredNoLocation.length > 0 && (
            <section className="space-y-3">
              {panelView === 'all' && (
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-200/70">Needs Attention</p>
                  <p className="text-xs text-slate-400">{filteredNoLocation.length} waiting for first location</p>
                </div>
              )}
              {filteredNoLocation.map((location) => {
                const { device } = location;
                const isOnline = (deviceStatuses[device.deviceUuid] ?? 'offline') === 'online';
                return (
                  <div key={device.deviceUuid} className="rounded-[28px] border border-amber-300/20 bg-amber-400/10 p-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-300/10 text-sm font-semibold text-amber-50">
                        {getDeviceLabel(device).slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{getDeviceLabel(device)}</p>
                            <p className="mt-1 truncate text-xs text-amber-50/70">{getDeviceSubtitle()}</p>
                          </div>
                          <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[0.68rem] font-medium',
                            isOnline ? 'border-emerald-300/20 bg-emerald-400/12 text-emerald-100' : 'border-amber-300/15 bg-slate-950/20 text-amber-100')}>
                            {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/15 bg-slate-950/25 px-2.5 py-1 text-[0.68rem] text-amber-50">
                            <ShieldAlert className="h-3.5 w-3.5" />No location recorded
                          </span>
                        </div>
                        <div className="mt-3 rounded-2xl border border-amber-200/15 bg-slate-950/25 p-3">
                          <p className="text-xs leading-5 text-amber-50/80">This device has not uploaded any trackable coordinates yet. Keep it online and confirm location permissions plus GPS access on the handset.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="all-devices-map-page relative min-h-[100dvh] overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-6%] h-72 w-72 rounded-full bg-cyan-500/18 blur-[120px]" />
        <div className="absolute right-[-12%] top-[18%] h-80 w-80 rounded-full bg-fuchsia-500/14 blur-[140px]" />
        <div className="absolute bottom-[-12%] left-[20%] h-96 w-96 rounded-full bg-emerald-500/12 blur-[150px]" />
      </div>

      <div className="relative flex h-[100dvh] flex-col p-0 lg:p-5">
        <div className="grid flex-1 min-h-0 gap-0 lg:gap-3 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
          <section className="relative min-h-0 overflow-hidden bg-slate-950 lg:rounded-[34px] lg:border lg:border-white/10">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[710] flex items-center justify-between px-3 lg:hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.85rem)' }}>
              <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/72 px-3 py-1.5 text-[0.7rem] font-medium text-white backdrop-blur-xl">
                <MapPin className="h-3.5 w-3.5 text-cyan-200" />Live map
              </div>
              <div className="pointer-events-auto flex items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/72 px-2.5 py-1.5 text-[0.66rem] font-medium text-slate-100 backdrop-blur-xl">
                  <Wifi className="h-3 w-3 text-emerald-200" />{onlineCount}
                </div>
                <button type="button" onClick={handleRefresh} disabled={loading}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-950/72 text-white backdrop-blur-xl disabled:opacity-60" aria-label="Refresh locations">
                  <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
                </button>
              </div>
            </div>

            {(loading || devicesLoading) && (
              <div className="absolute inset-0 z-[750] flex items-center justify-center bg-slate-950/70">
                <div className="rounded-[28px] border border-white/10 bg-slate-900 px-8 py-7 text-center">
                  <Loader2 className="mx-auto h-9 w-9 animate-spin text-cyan-300" />
                  <p className="mt-4 text-sm font-medium text-white">Loading device locations</p>
                  <p className="mt-1 text-xs text-slate-400">Syncing the newest coordinates and connection state.</p>
                </div>
              </div>
            )}

            <MapContainer center={defaultCenter} zoom={5} zoomControl={false} className="h-full w-full" style={{ height: '100%', width: '100%' }} key={`map-${refreshKey}`}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <ZoomControl position="bottomright" />
              <MapRefCapture mapRef={mapRef} />
              {!loading && <FitBounds locations={locations} mapRef={mapRef} />}

              {located.map(({ device, point }) => {
                const isOnline = (deviceStatuses[device.deviceUuid] ?? 'offline') === 'online';
                const initials = getDeviceLabel(device).slice(0, 2).toUpperCase();
                const isSelected = selectedUuid === device.deviceUuid;
                const pin = makePin(
                  isOnline ? (isSelected ? '#22d3ee' : '#14b8a6') : (isSelected ? '#cbd5e1' : '#64748b'),
                  initials, isSelected
                );
                const effectivePoint = liveLocations[device.deviceUuid] ?? point;
                return (
                  <Marker key={device.deviceUuid} position={[effectivePoint.latitude, effectivePoint.longitude]} icon={pin}
                    eventHandlers={{ click: () => setSelectedUuid(device.deviceUuid) }}>
                    <Popup minWidth={240} maxWidth={240}>
                      <div style={{ width: 220, padding: 12, background: '#0f172a', color: 'white', borderRadius: 12 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{getDeviceLabel(device)}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 8 }}>
                            <p style={{ fontSize: 9, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>Speed</p>
                            <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{formatSpeed(effectivePoint.speed)}</p>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 8 }}>
                            <p style={{ fontSize: 9, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>Updated</p>
                            <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{formatTimeAgo(effectivePoint.receivedAt)}</p>
                          </div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 8, marginBottom: 8, fontFamily: 'monospace', fontSize: 11, color: '#cbd5e1' }}>
                          <div>{effectivePoint.latitude.toFixed(6)}, {effectivePoint.longitude.toFixed(6)}</div>
                          <div style={{ color: '#94a3b8' }}>{formatTimestamp(effectivePoint.receivedAt)}</div>
                        </div>
                        <button type="button" onClick={() => handleOpenTracking(device.deviceUuid)}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '7px 0', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                          <ArrowUpRight style={{ width: 12, height: 12 }} />Open tracking
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            <div className="absolute inset-x-0 bottom-0 z-[720] lg:hidden">
              <div className={cn('rounded-t-[30px] border-x border-t border-white/10 bg-slate-950 transition-all duration-300', mobileSheetExpanded ? 'h-[82dvh]' : 'h-[25rem]')}
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.6rem)' }}>
                <div className="flex items-center justify-center px-4 pt-3">
                  <div className="mx-auto h-1.5 w-12 rounded-full bg-white/15" />
                </div>
                <div className="flex items-center justify-between px-4 pb-1 pt-3">
                  <div>
                    <p className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-slate-400">Device Drawer</p>
                    <p className="mt-1 text-[0.84rem] font-semibold text-white">Native mobile feed</p>
                  </div>
                  <button type="button" onClick={() => setMobileSheetExpanded((v) => !v)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[16px] border border-white/10 bg-white/5 px-3 text-[0.7rem] font-medium text-white">
                    {mobileSheetExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
                    {mobileSheetExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                <div className="flex h-[calc(100%-4.5rem)] flex-col min-h-0">{renderPanelContent(true)}</div>
              </div>
            </div>
          </section>

          <aside className="hidden min-h-0 overflow-hidden rounded-[34px] border border-white/10 bg-slate-950 shadow-[0_28px_90px_rgba(2,6,23,0.42)] lg:flex lg:flex-col">
            {renderPanelContent(false)}
          </aside>
        </div>
      </div>
      {registerModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget && !registering) setRegisterModal(false); }}>
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-900 shadow-[0_32px_80px_rgba(2,6,23,0.6)]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-cyan-400/15 border border-cyan-400/20">
                  <Plus className="h-4 w-4 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Register Device</p>
                  <p className="text-xs text-slate-400">Add a new tracked device</p>
                </div>
              </div>
              <button type="button" onClick={() => setRegisterModal(false)} disabled={registering}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-colors disabled:opacity-40">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Device UUID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={registerForm.deviceUuid}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, deviceUuid: e.target.value }))}
                  placeholder="e.g. abc123-def456"
                  disabled={registering}
                  className="w-full rounded-[14px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 disabled:opacity-60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Device Name <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={registerForm.deviceName}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, deviceName: e.target.value }))}
                  placeholder="e.g. Device name"
                  disabled={registering}
                  className="w-full rounded-[14px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 disabled:opacity-60 transition-colors"
                />
              </div>

              {registerError && (
                <div className="flex items-start gap-2 rounded-[12px] border border-red-400/20 bg-red-400/10 px-3.5 py-2.5">
                  <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 leading-5">{registerError}</p>
                </div>
              )}

              {registerSuccess && (
                <div className="flex items-center gap-2 rounded-[12px] border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2.5">
                  <Wifi className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300">{registerSuccess}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setRegisterModal(false)} disabled={registering}
                  className="flex-1 rounded-[14px] border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-40">
                  Cancel
                </button>
                <button type="submit" disabled={registering}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-[14px] bg-cyan-500 py-2.5 text-sm font-semibold text-white hover:bg-cyan-400 transition-colors disabled:opacity-60">
                  {registering ? <><Loader2 className="h-4 w-4 animate-spin" />Registering…</> : 'Register Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllDevicesMapPage;
