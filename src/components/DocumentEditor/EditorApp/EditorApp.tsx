// EditorApp.tsx
import Box from "@mui/material/Box";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import Tiptap from "../Editor/Tiptap";
import { useState } from "react";

// Create one Y.Doc
const ydoc = new Y.Doc();
const room = "shared-doc";
const fontSize = "17px";
function EditorApp() {
  const [isConnected, setIsConnected] = useState(false);

  const provider = new HocuspocusProvider({
    url: "ws://localhost:1234",
    name: room,
    document: ydoc,
    onConnect() {
      setIsConnected(true); // reactive now
    },
    onDisconnect() {
      setIsConnected(false);
    },
  });

  return (
    <Box>
      <Tiptap
        ydoc={ydoc}
        provider={provider}
        room={room}
        isConnected={isConnected}
        fontSize={fontSize}
      />
    </Box>
  );
}

export default EditorApp;
