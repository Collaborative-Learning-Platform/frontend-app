import Box from "@mui/material/Box";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import Tiptap from "../Editor/Tiptap";

// Create one Y.Doc
const ydoc = new Y.Doc();

const room = "shared-doc";

const provider = new HocuspocusProvider({
  url: "ws://localhost:1234", // your hocuspocus backend
  name: room,
  document: ydoc,
});

function EditorApp() {
  return (
    <Box>
      <Tiptap provider={provider} ydoc={ydoc} room={room} />
    </Box>
  );
}

export default EditorApp;
