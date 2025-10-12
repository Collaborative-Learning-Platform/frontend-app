import { useEffect, useRef } from "react";
import { Tldraw, createTLStore, defaultShapeUtils } from "tldraw";
import type { TLRecord } from "tldraw";
import "tldraw/tldraw.css";

interface WhiteboardProps {
  roomId: string;
  sessionId?: string;
  wsUrl?: string;
}

export default function Whiteboard({
  roomId,
  sessionId = `user-${Date.now()}`,
  wsUrl = "ws://localhost:8080",
}: WhiteboardProps) {
  const storeRef = useRef<ReturnType<typeof createTLStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createTLStore({ shapeUtils: defaultShapeUtils });
  }
  const store = storeRef.current;
  // const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const isUpdating = useRef(false);
  const mountedRef = useRef(true);
  const storeListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    mountedRef.current = true;
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
      // setIsConnected(true);
    };

    ws.onmessage = (event) => {
      if (!mountedRef.current) return;

      try {
        const message = JSON.parse(event.data);
        if (message.type === "room-state" && message.state?.records) {
          console.log(
            "Loading initial state with",
            Object.keys(message.state.records).length,
            "records"
          );
          isUpdating.current = true;

          store.mergeRemoteChanges(() => {
            const allRecords = store.allRecords();
            const shapesToRemove = allRecords.filter(
              (record) =>
                record.typeName === "shape" || record.typeName === "binding"
            );
            if (shapesToRemove.length > 0) {
              store.remove(shapesToRemove.map((r) => r.id));
            }

            const records = Object.values(message.state.records) as TLRecord[];
            if (records.length > 0) {
              store.put(records);
            }
          });

          isUpdating.current = false;
        }
        if (
          message.type === "document-update" &&
          message.data &&
          message.sessionId !== sessionId
        ) {
          isUpdating.current = true;

          store.mergeRemoteChanges(() => {
            if (message.data.removedIds && message.data.removedIds.length > 0) {
              try {
                store.remove(message.data.removedIds);
                console.log("Successfully removed records");
              } catch (error) {
                console.error("REMOVAL ERROR:", error);
              }
            }

            if (message.data.records) {
              const records = Object.values(message.data.records) as TLRecord[];
              if (records.length > 0) {
                console.log("Adding/updating", records.length, "records");
                try {
                  store.put(records);
                  console.log("Successfully added/updated records");
                } catch (error) {
                  console.error("Error putting records:", error);
                }
              }
            }
          });

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
      // setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    const setupStoreListener = () => {
      if (storeListenerRef.current) {
        storeListenerRef.current();
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
          const addedRecords: TLRecord[] = [];
          const updatedRecords: TLRecord[] = [];
          const removedRecords: TLRecord[] = [];

          if (changes.added) {
            if (Array.isArray(changes.added)) {
              addedRecords.push(...changes.added);
            } else {
              Object.values(changes.added).forEach((record) =>
                addedRecords.push(record)
              );
            }
          }

          if (changes.updated) {
            if (Array.isArray(changes.updated)) {
              changes.updated.forEach(([_, record]) =>
                updatedRecords.push(record)
              );
            } else {
              Object.values(changes.updated).forEach(([_, record]) =>
                updatedRecords.push(record)
              );
            }
          }

          if (changes.removed) {
            if (Array.isArray(changes.removed)) {
              removedRecords.push(...changes.removed);
            } else {
              Object.values(changes.removed).forEach((record) =>
                removedRecords.push(record)
              );
            }
          }

          const filterDrawingRecords = (records: TLRecord[]) =>
            records.filter(
              (record) =>
                record.typeName === "shape" ||
                record.typeName === "binding" ||
                record.typeName === "asset" ||
                record.typeName === "page"
            );

          const drawingAdded = filterDrawingRecords(addedRecords);
          const drawingUpdated = filterDrawingRecords(updatedRecords);
          const drawingRemoved = filterDrawingRecords(removedRecords);

          if (
            drawingAdded.length > 0 ||
            drawingUpdated.length > 0 ||
            drawingRemoved.length > 0
          ) {
            const putRecords: Record<string, TLRecord> = {};
            const removeIds: string[] = [];

            [...drawingAdded, ...drawingUpdated].forEach(
              (record) => (putRecords[record.id] = record)
            );

            drawingRemoved.forEach((record) => removeIds.push(record.id));

            const message = {
              type: "document-update",
              data: {
                records: putRecords,
                removedIds: removeIds,
              },
              timestamp: Date.now(),
            };

            ws.send(JSON.stringify(message));
          }
        },
        { source: "user", scope: "document" }
      );
    };

    ws.addEventListener("open", setupStoreListener);

    return () => {
      // console.log("Cleaning up WebSocket connection");
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
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
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
      </div> */}

      <Tldraw store={store} />
    </div>
  );
}
