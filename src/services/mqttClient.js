import mqtt from 'mqtt';

const MQTT_BROKER_URL = import.meta.env.VITE_MQTT_WS_URL || 'ws://localhost:9001/mqtt';

let client = null;
let subscribedStatusTopic = null;
const statusListeners = new Set();
const liveListeners = new Set();

function getUserEmail() {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.email ?? null;
  } catch {
    return null;
  }
}

export function connectMqtt() {
  if (client?.connected) return;

  const email = getUserEmail();
  if (email === null) return;

  if (client) {
    client.removeAllListeners();
    client.end(true);
    client = null;
  }

  client = mqtt.connect(MQTT_BROKER_URL, {
    clientId: `dragon-web-${email}`,
    clean: true,
    reconnectPeriod: 5000,
    connectTimeout: 10000,
  });

  const statusTopic = `device/${email}/status`;
  const liveTopic   = 'tracking/device/+/live';

  client.on('connect', () => {
    console.log('[MQTT] Connected to broker');
    client.subscribe(statusTopic, { qos: 1 }, (err) => {
      if (err) {
        console.error('[MQTT] Subscribe error (status):', err);
      } else {
        subscribedStatusTopic = statusTopic;
        console.log('[MQTT] Subscribed to:', statusTopic);
      }
    });
    client.subscribe(liveTopic, { qos: 0 }, (err) => {
      if (err) {
        console.error('[MQTT] Subscribe error (live):', err);
      } else {
        console.log('[MQTT] Subscribed to:', liveTopic);
      }
    });
  });

  client.on('message', (topic, payload) => {
    if (topic.startsWith('tracking/device/') && topic.endsWith('/live')) {
      const parts = topic.split('/');
      const deviceUuid = parts[2];
      try {
        const raw = JSON.parse(payload.toString());
        const points = Array.isArray(raw) ? raw : [raw];
        liveListeners.forEach((cb) => cb({ deviceUuid, points }));
      } catch (err) {
        console.error('[MQTT] Failed to parse live message:', err);
      }
      return;
    }

    // Device status messages
    try {
      const event = JSON.parse(payload.toString());
      statusListeners.forEach((cb) => cb(event));
    } catch (err) {
      console.error('[MQTT] Failed to parse status message:', err);
    }
  });

  client.on('error', (err) => console.error('[MQTT] Connection error:', err));
  client.on('reconnect', () => console.log('[MQTT] Reconnecting...'));
  client.on('close', () => console.log('[MQTT] Connection closed'));
}

export function disconnectMqtt() {
  if (client) {
    if (subscribedStatusTopic) {
      client.unsubscribe(subscribedStatusTopic);
      subscribedStatusTopic = null;
    }
    client.end(true);
    client = null;
  }
}

export function onDeviceStatus(callback) {
  statusListeners.add(callback);
  return () => statusListeners.delete(callback);
}

export function onLiveLocation(callback) {
  liveListeners.add(callback);
  return () => liveListeners.delete(callback);
}

export function isConnected() {
  return client?.connected ?? false;
}
