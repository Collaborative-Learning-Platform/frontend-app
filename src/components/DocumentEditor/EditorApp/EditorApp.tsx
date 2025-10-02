// EditorApp.tsx
import Box from '@mui/material/Box';
import { getProvider } from '../Provider/providerStore';
import Tiptap from '../Editor/Tiptap';
// import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// Create one Y.Doc
// const ydoc = new Y.Doc();
// const room = "shared-doc";

const fontSize = '17px';

function EditorApp() {
  const { room } = useParams();
  const location = useLocation();
  const documentData = location.state as {
    documentId: string;
    title: string;
    groupId: string;
    groupName: string;
  } | null;

  const { provider, isConnected } = getProvider(room || 'untitled-room');

  const ydoc = provider.document;

  return (
    <Box>
      <Tiptap
        ydoc={ydoc}
        provider={provider}
        isConnected={isConnected}
        fontSize={fontSize}
        documentData={documentData}
      />
    </Box>
  );
}

export default EditorApp;
