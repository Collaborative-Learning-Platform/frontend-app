// EditorApp.tsx
import Box from '@mui/material/Box';
import { destroyProvider, getProvider } from '../Provider/providerStore';
import Tiptap from '../Editor/Tiptap';
// import { useMemo } from 'react';
import { useBeforeUnload, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
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

  useBeforeUnload(() => {
    destroyProvider(room || 'untitled-room');
  });

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
