"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

interface MessageWebSocketContextType {
  isConnected: boolean;
  isSubscribed: boolean;
  sendMessage: (payload: any) => void;
  subscribe: (handler: (data: any) => void) => () => void;
}

const MessageWebSocketContext = createContext<MessageWebSocketContextType>({
  isConnected: false,
  isSubscribed: false,
  sendMessage: () => {},
  subscribe: () => () => {},
});

// ─── Window-persisted singleton (survives HMR + StrictMode) ───
function getG() {
  const w = window as any;
  if (!w.__vsMessageWs) {
    w.__vsMessageWs = {
      ws: null as WebSocket | null,
      handlers: new Set<(data: any) => void>(),
      connected: false,
      subscribed: false,
      userId: null as string | null,
      listeners: new Set<() => void>(),
    };
  }
  return w.__vsMessageWs as {
    ws: WebSocket | null;
    handlers: Set<(data: any) => void>;
    connected: boolean;
    subscribed: boolean;
    userId: string | null;
    listeners: Set<() => void>;
  };
}

function notify() {
  getG().listeners.forEach((fn: () => void) => fn());
}

function processMsg(raw: string) {
  if (!raw || !raw.trim()) return;
  const g = getG();
  console.log("[WS] Received:", raw.substring(0, 150));
  try {
    const parsed = JSON.parse(raw);
    if (parsed.event === "subscribed") {
      g.subscribed = true;
      notify();
      console.log("[WS] Subscription confirmed!");
    }
    g.handlers.forEach((h) => h(parsed));
  } catch (err) {
    console.error("[WS] Parse error:", err);
  }
}

function connectWs(token: string, uuid: string) {
  const g = getG();

  // Already connected for this user
  if (g.ws && g.userId === uuid) {
    const s = g.ws.readyState;
    if (s === WebSocket.OPEN || s === WebSocket.CONNECTING) return;
  }

  // Close stale
  if (g.ws) {
    try { g.ws.close(); } catch (_) {}
    g.ws = null;
  }

  g.userId = uuid;
  g.connected = false;
  g.subscribed = false;
  notify();

  console.log("[WS] Connecting...");
  const ws = new WebSocket(`wss://secure-wss-server.villagesquare.io/?token=${token}`);
  g.ws = ws;

  ws.onopen = () => {
    if (g.ws !== ws) return;
    console.log("[WS] Connected.");
    g.connected = true;
    notify();

    console.log("[WS] Subscribing...");
    ws.send(JSON.stringify({
      action: "subscribe",
      channel: "message",
      channelId: `message_${uuid}`,
      userId: uuid,
    }));
  };

  ws.onmessage = (event) => {
    if (g.ws !== ws) return;
    if (typeof event.data === "string") {
      processMsg(event.data);
    } else if (event.data instanceof Blob) {
      event.data.text().then(processMsg);
    } else if (event.data instanceof ArrayBuffer) {
      processMsg(new TextDecoder().decode(event.data));
    }
  };

  ws.onerror = (err) => console.error("[WS] Error:", err);

  ws.onclose = (ev) => {
    console.log("[WS] Closed:", ev.code, ev.reason);
    if (g.ws === ws) {
      g.ws = null;
      g.connected = false;
      g.subscribed = false;
      g.userId = null;
      notify();
    }
  };
}

export const MessageWebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const user = session?.user;

  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Sync React state from singleton
  useEffect(() => {
    const g = getG();
    const sync = () => {
      setIsConnected(g.connected);
      setIsSubscribed(g.subscribed);
    };
    g.listeners.add(sync);
    sync();
    return () => { g.listeners.delete(sync); };
  }, []);

  // Connect when user available
  useEffect(() => {
    if (user?.token && user?.uuid) {
      connectWs(user.token, user.uuid);
    }
  }, [user?.token, user?.uuid]);

  // Close on page unload
  useEffect(() => {
    const onUnload = () => {
      const g = getG();
      if (g.ws) { g.ws.close(); g.ws = null; }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const sendMessage = useCallback((payload: any) => {
    const g = getG();
    if (g.ws && g.ws.readyState === WebSocket.OPEN) {
      g.ws.send(JSON.stringify(payload));
    } else {
      console.warn("[WS] Cannot send, not connected.");
    }
  }, []);

  const subscribe = useCallback((handler: (data: any) => void) => {
    const g = getG();
    g.handlers.add(handler);
    return () => { g.handlers.delete(handler); };
  }, []);

  return (
    <MessageWebSocketContext.Provider value={{ isConnected, isSubscribed, sendMessage, subscribe }}>
      {children}
    </MessageWebSocketContext.Provider>
  );
};

export const useMessageWebSocket = () => useContext(MessageWebSocketContext);
