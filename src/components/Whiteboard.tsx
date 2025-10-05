import { useEffect, useRef, useState } from "react";
import { Tldraw, createTLStore, defaultShapeUtils } from "tldraw";
import type { TLRecord } from "tldraw";
import "tldraw/tldraw.css";

interface SimpleWhiteboardProps {
  roomId: string;
  sessionId?: string;
  wsUrl?: string;
}

export default function SimpleWhiteboard({
  roomId,
  sessionId = `user-${Date.now()}`,
  wsUrl = "ws://localhost:8080",
}: SimpleWhiteboardProps) {
  
  const storeRef = useRef<ReturnType<typeof createTLStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createTLStore({ shapeUtils: defaultShapeUtils });
  }
  const store = storeRef.current;

  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const isUpdating = useRef(false);
  const mountedRef = useRef(true);
  const storeListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    // Connect to WebSocket
    console.log(
      "Connecting to:",
      `${wsUrl}/connect/${roomId}?sessionId=${sessionId}`
    );
    const ws = new WebSocket(
      `${wsUrl}/connect/${roomId}?sessionId=${sessionId}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      console.log("Connected to whiteboard");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      if (!mountedRef.current) return;

      try {
        const message = JSON.parse(event.data);
        if (message.type === "room-state" && message.state?.records) {
          // Load initial state
          console.log(
            "Loading initial state with",
            Object.keys(message.state.records).length,
            "records"
          );
          isUpdating.current = true;

          // Don't clear the store completely - only remove shapes and preserve essential records
          const allRecords = store.allRecords();
          const shapesToRemove = allRecords.filter(
            (record) =>
              record.typeName === "shape" || record.typeName === "binding"
          );
          if (shapesToRemove.length > 0) {
            store.remove(shapesToRemove.map((r) => r.id));
          }

          // Add new records
          const records = Object.values(message.state.records) as TLRecord[];
          if (records.length > 0) {
            store.put(records);
          }
          isUpdating.current = false;
        }

        if (
          message.type === "document-update" &&
          message.data?.records &&
          message.sessionId !== sessionId
        ) {
          // Apply updates from other users
          console.log(
            "Received update from",
            message.sessionId,
            "with",
            Object.keys(message.data.records).length,
            "records"
          );
          isUpdating.current = true;
          const records = Object.values(message.data.records) as TLRecord[];
          store.put(records);
          isUpdating.current = false;
        }

        if (message.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      console.log("Disconnected from whiteboard");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Set up store listener - only once when WebSocket connects
    const setupStoreListener = () => {
      if (storeListenerRef.current) {
        storeListenerRef.current(); // Remove existing listener
      }
      storeListenerRef.current = store.listen(
        (entry) => {
          if (
            isUpdating.current ||
            !mountedRef.current ||
            ws.readyState !== WebSocket.OPEN
          )
            return;

          const { changes } = entry;
          const changedRecords: TLRecord[] = [];

          // Collect all changes - handle both array and object formats
          if (changes.added) {
            if (Array.isArray(changes.added)) {
              changedRecords.push(...changes.added);
            } else {
              Object.values(changes.added).forEach((record) =>
                changedRecords.push(record)
              );
            }
          }

          if (changes.updated) {
            if (Array.isArray(changes.updated)) {
              changes.updated.forEach(([_, record]) =>
                changedRecords.push(record)
              );
            } else {
              Object.values(changes.updated).forEach(([_, record]) =>
                changedRecords.push(record)
              );
            }
          }

          if (changes.removed) {
            if (Array.isArray(changes.removed)) {
              changedRecords.push(...changes.removed);
            } else {
              Object.values(changes.removed).forEach((record) =>
                changedRecords.push(record)
              );
            }
          }

          // Send only drawing-related records
          const drawingRecords = changedRecords.filter(
            (record) =>
              record.typeName === "shape" ||
              record.typeName === "binding" ||
              record.typeName === "asset" ||
              record.typeName === "page"
          );

          if (drawingRecords.length > 0) {
            const recordsMap: Record<string, TLRecord> = {};
            drawingRecords.forEach(
              (record) => (recordsMap[record.id] = record)
            );

            const message = {
              type: "document-update",
              data: { records: recordsMap },
              timestamp: Date.now(),
            };

            ws.send(JSON.stringify(message));
            console.log("Sent", drawingRecords.length, "records to server");
          }
        },
        { source: "user", scope: "document" }
      );
    };

    // Set up store listener when connected
    ws.addEventListener("open", setupStoreListener);

    // Cleanup function
    return () => {
      console.log("Cleaning up WebSocket connection");
      mountedRef.current = false;

      if (storeListenerRef.current) {
        storeListenerRef.current();
        storeListenerRef.current = null;
      }

      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "Component unmounting");
      }
      wsRef.current = null;
    };
  }, []); // Empty dependency array - this is crucial!

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Connection indicator */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          background: isConnected ? "#22c55e" : "#ef4444",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>

      {/* The whiteboard */}
      <Tldraw store={store} />
    </div>
  );
}
