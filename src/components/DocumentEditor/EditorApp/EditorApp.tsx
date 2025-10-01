// EditorApp.tsx
import Box from "@mui/material/Box";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import Tiptap from "../Editor/Tiptap";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
// Create one Y.Doc
// const ydoc = new Y.Doc();
// const room = "shared-doc";

const fontSize = "17px";

function EditorApp() {
  const { room } = useParams();
  const location = useLocation();
  const documentData = location.state as {
    documentId: string;
    title: string;
    groupId: string;
    groupName: string;
  } | null;
  // const [isConnected, setIsConnected] = useState(false);
  const ydoc = useMemo(() => new Y.Doc(), []);

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: "ws://localhost:1234",
        name: room || "untitled-room",
        document: ydoc,
        // onConnect() {
        //   setIsConnected(true); // reactive now
        // },
        // onDisconnect() {
        //   setIsConnected(false);
        // },
      }),
    [room, ydoc]
  );

  return (
    <Box>
      <Tiptap
        ydoc={ydoc}
        provider={provider}
        // isConnected={isConnected}
        fontSize={fontSize}
        documentData={documentData}
      />
    </Box>
  );
}

export default EditorApp;
