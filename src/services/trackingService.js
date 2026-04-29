import ApiService from './apiService';

// Spring's @RequestParam LocalDateTime expects "yyyy-MM-dd HH:mm:ss" (space, not T)
function toSpringDT(isoStr) {
  if (!isoStr) return undefined;
  return String(isoStr).replace('T', ' ').slice(0, 19);
}

// ── Tracked devices ───────────────────────────────────────────────────────────

export const trackingDeviceService = {
  async getDevices() {
    return ApiService.get('/tracking/devices');
  },
  async registerDevice(data) {
    return ApiService.post('/tracking/devices/register', data);
  },
};

// ── Main tracking service ─────────────────────────────────────────────────────

export const trackingService = {
  async getGeofenceTypes(deviceUuid) {
    return ApiService.get(`/tracking/${deviceUuid}/enums/geofence-types`);
  },

  async getHistory(deviceUuid, params = {}) {
    const q = new URLSearchParams();
    q.set('page', params.page ?? 0);
    q.set('size', params.size ?? 50);
    if (params.from) q.set('from', toSpringDT(params.from));
    if (params.to)   q.set('to',   toSpringDT(params.to));
    return ApiService.get(`/tracking/${deviceUuid}/history?${q}`);
  },

  async bulkCreateTrackingPoints(deviceUuid, points) {
    return ApiService.post(`/tracking/${deviceUuid}/create`, points);
  },

  async getGeofences(deviceUuid, params = {}) {
    return ApiService.get(`/tracking/${deviceUuid}/geofences`, {
      page: params.page ?? 0,
      size: params.size ?? 200,
    });
  },

  async createGeofence(deviceUuid, req) {
    return ApiService.post(`/tracking/${deviceUuid}/geofences`, req);
  },

  async updateGeofence(deviceUuid, id, req) {
    return ApiService.put(`/tracking/${deviceUuid}/geofences/${id}`, req);
  },

  async deleteGeofence(deviceUuid, id) {
    return ApiService.delete(`/tracking/${deviceUuid}/geofences/${id}`);
  },

  async getConfig(deviceUuid) {
    return ApiService.get(`/tracking/${deviceUuid}/config`);
  },

  async updateConfig(deviceUuid, req) {
    return ApiService.put(`/tracking/${deviceUuid}/config`, req);
  },

  async getGeofenceEvents(deviceUuid, params = {}) {
    return ApiService.get(`/tracking/${deviceUuid}/geofenceEvents`, {
      page: params.page ?? 0,
      size: params.size ?? 30,
    });
  },

  async getTrips(deviceUuid, params = {}) {
    return ApiService.get(`/tracking/${deviceUuid}/trips`, {
      page: params.page ?? 0,
      size: params.size ?? 20,
      ...(params.from && { from: toSpringDT(params.from) }),
      ...(params.to   && { to:   toSpringDT(params.to)   }),
    });
  },

  async getTrip(deviceUuid, id) {
    return ApiService.get(`/tracking/${deviceUuid}/trips/${id}`);
  },

  async getTrackingEvents(deviceUuid, params = {}) {
    return ApiService.get(`/tracking/${deviceUuid}/events`, {
      page: params.page ?? 0,
      size: params.size ?? 50,
      ...(params.type && { type: params.type }),
      ...(params.from && { from: toSpringDT(params.from) }),
      ...(params.to   && { to:   toSpringDT(params.to)   }),
    });
  },

  async getAnalytics(deviceUuid, params = {}) {
    return ApiService.get(`/tracking/${deviceUuid}/analytics`, {
      ...(params.from && { from: toSpringDT(params.from) }),
      ...(params.to   && { to:   toSpringDT(params.to)   }),
    });
  },
};
