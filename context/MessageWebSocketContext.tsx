"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
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

export const MessageWebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const user = session?.user;

  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Set<(data: any) => void>>(new Set());

  const sendMessage = useCallback((payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("[WS] Sending message:", payload);
      wsRef.current.send(JSON.stringify(payload));
    } else {
      console.warn("[WS] Cannot send message, WebSocket is not open.");
    }
  }, []);

  const subscribe = useCallback((handler: (data: any) => void) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  useEffect(() => {
    if (!user?.token || !user?.uuid) return;

    const wsUrl = `wss://secure-wss-server.villagesquare.io/?token=${user.token}`;
    console.log(
      "[WS] Connecting to:",
      wsUrl.replace(user.token, "[HIDDEN_TOKEN]"),
    );

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS] Connected successfully.");
      setIsConnected(true);
      setIsSubscribed(false);

      const subscribePayload = {
        action: "subscribe",
        channel: "message",
        channelId: `message_${user.uuid}`,
        userId: user.uuid,
      };
      console.log(
        "[WS] Sending subscribe payload:",
        JSON.stringify(subscribePayload),
      );
      ws.send(JSON.stringify(subscribePayload));
    };

    ws.onmessage = async (event) => {
      let dataStr = "";
      if (event.data instanceof Blob) {
        dataStr = await event.data.text();
      } else {
        dataStr = event.data;
      }

      if (!dataStr || dataStr.trim() === "") return;

      console.log("[WS] Raw message received:", dataStr);

      try {
        const parsedData = JSON.parse(dataStr);
        console.log("[WS] Received data:", parsedData);

        if (parsedData.event === "subscribed") {
          console.log("WS - Subscription confirmed!");
          setIsSubscribed(true);
        }

        
        handlersRef.current.forEach((handler) => handler(parsedData));
      } catch (err) {
        console.error("[WS] Error parsing message:", dataStr, err);
      }
    };

    ws.onerror = (error) => {
      console.error("[WS] WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("[WS] WebSocket closed", event.code, event.reason);
      setIsConnected(false);
      setIsSubscribed(false);
      wsRef.current = null;
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setIsSubscribed(false);
    };
  }, [user?.token, user?.uuid]);

  return (
    <MessageWebSocketContext.Provider
      value={{ isConnected, isSubscribed, sendMessage, subscribe }}
    >
      {children}
    </MessageWebSocketContext.Provider>
  );
};

export const useMessageWebSocket = () => useContext(MessageWebSocketContext);
