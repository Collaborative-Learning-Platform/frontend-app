import { useEditor, EditorContent } from '@tiptap/react';
import '../../../styles/components/DocumentEditor/Tiptap.css';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { Formatbar } from '../Toolbars/Formatbar';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { ListKit } from '@tiptap/extension-list';
import Link from '@tiptap/extension-link';
import {
  TextStyle,
  Color,
  FontSize,
  FontFamily,
} from '@tiptap/extension-text-style';
import { Image } from '@tiptap/extension-image';
import { CharacterCount } from '@tiptap/extensions';
import { TableKit } from '@tiptap/extension-table';
// import { Pagination } from "tiptap-pagination-breaks";
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import Highlight from '@tiptap/extension-highlight';
import { useEffect, useMemo, useState } from 'react';
import type { User } from '../Types/User';
import { Titlebar } from '../Toolbars/Titlebar';
import { useAuth } from '../../../contexts/Authcontext';

const colors = [
  '#958DF1',
  '#F98181',
  '#FBBC88',
  '#FAF594',
  '#70CFF8',
  '#94FADB',
  '#B9F18D',
  '#C3E2C2',
  '#EAECCC',
  '#AFC8AD',
  '#EEC759',
  '#9BB8CD',
  '#FF90BC',
  '#FFC0D9',
  '#DC8686',
  '#7ED7C1',
  '#F3EEEA',
  '#89B9AD',
  '#D0BFFF',
  '#FFF8C9',
  '#CBFFA9',
  '#9BABB8',
  '#E3F4F4',
];

const getRandomElement = (list: any) =>
  list[Math.floor(Math.random() * list.length)];

const getRandomColor = () => getRandomElement(colors);

interface documentData {
  documentId: string;
  title: string;
  groupId: string;
  groupName: string;
}

interface TiptapProps {
  provider: any;
  ydoc: any;
  fontSize: string;
  documentData: documentData | null;
  isConnected: boolean;
}

const Tiptap = ({
  ydoc,
  provider,
  fontSize,
  documentData,
  isConnected,
}: TiptapProps) => {
  const theme = useTheme();
  const color = getRandomColor();
  const { name, loading, user_id } = useAuth();
  const [status, setStatus] = useState('connecting');
  const [users, setUsers] = useState<User[] | null>(null);
  const [currentUser, setCurrentUser] = useState({
    name: name || 'Anonymous',
    color: color,
    user_id: user_id,
  });

  useEffect(() => {
    if (isConnected) {
      setStatus('connected');
    } else {
      setStatus('disconnected');
    }
  }, [isConnected]);

  useEffect(() => {
    if (!loading && name && user_id) {
      setCurrentUser({
        name,
        color: color,
        user_id,
      });

      editor.commands.updateUser({
        name: name,
        color: color,
        user_id: user_id,
      });
    }
  }, [loading, name, user_id]);

  // useEffect(() => {
  //   if (isConnected) {
  //     setStatus("connected");
  //   }
  // }, [isConnected]);

  const editor = useEditor({
    enableContentCheck: true,
    onContentError: ({ disableCollaboration }) => {
      disableCollaboration();
    },

    onCreate: ({ editor: currentEditor }) => {
      provider.on('synced', () => {
        if (currentEditor.isEmpty) {
          currentEditor.commands.setContent('');
        }
        currentEditor.commands.setFontSize(fontSize);
      });
    },
    extensions: [
      Document,
      Text,
      Paragraph,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
      TextStyle,
      FontFamily,
      Color,
      FontSize,
      ListKit,
      Image,
      Link.configure({
        openOnClick: true,
      }),
      Highlight,
      TableKit,
      CharacterCount.extend().configure({
        limit: 10000,
      }),
      Collaboration.extend().configure({
        document: ydoc,
      }),
      CollaborationCaret.extend().configure({
        provider,
      }),
      // Pagination.configure({
      //   pageHeight: 1056, // default height of the page
      //   pageWidth: 816, // default width of the page
      //   pageMargin: 96, // default margin of the page
      // }),
    ],

    content: '',
  });

  useEffect(() => {
    // HocuspocusProvider official events

    const connectHandler = () => {
      console.log('Provider connected!');
      setStatus('connected');
    };

    const disconnectHandler = () => {
      console.log('Provider disconnected!');
      setStatus('disconnected');
    };

    const statusHandler = (event: any) => {
      console.log('Status event:', event);
      setStatus('connected');
    };

    // Listen to all relevant events
    provider.on('connect', connectHandler);
    provider.on('disconnect', disconnectHandler);
    provider.on('status', statusHandler);
    provider.on('synced', () => console.log('Synced!'));

    // Check initial status
    console.log('Initial provider status:', provider.status);

    return () => {
      provider.off('connect', connectHandler);
      provider.off('disconnect', disconnectHandler);
      provider.off('status', statusHandler);
      provider.off('synced');
    };
  }, [provider]);

  // useEffect(() => {
  //   if (!editor || !currentUser) return;

  //   editor.commands.updateUser({
  //     name: currentUser.name,
  //     color: color,
  //     user_id: currentUser.user_id,
  //   });
  // }, [currentUser]);

  // Keep currentUser state for future AuthContext integration
  // setCurrentUser will be used when integrating with AuthContext

  if (!editor) {
    return null;
  }

  useEffect(() => {
    if (!provider) return;

    const awarenessHandler = () => {
      const states = provider.awareness.getStates();

      const entries = Array.from(states.entries()) as [number, any][];

      const usersArray = entries
        .filter(
          ([_, state]) => state.user && state.user.name && state.user.color
        )
        .map(([clientId, state]) => ({
          clientId,
          ...state.user,
        }));

      setUsers(usersArray);
      console.log('Awareness change:', { usersArray });
    };

    provider.on('awarenessUpdate', awarenessHandler);

    return () => {
      provider.off('awarenessUpdate', awarenessHandler);
    };
  }, [provider]);

  const commands = useMemo(
    () => ({
      toggleBold: () => editor?.chain().focus().toggleBold().run(),
      toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
      toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
      setTextAlign: (alignment: string) =>
        editor?.chain().focus().setTextAlign(alignment).run(),
      setColor: (color: string) => editor?.chain().setColor(color).run(),
      setFontSize: (size: string) => editor?.chain().setFontSize(size).run(),
      toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
      toggleOrderedList: () =>
        editor?.chain().focus().toggleOrderedList().run(),
      insertImage: (url: string) =>
        editor?.chain().focus().setImage({ src: url }).run(),
      setLink: (url: string) =>
        editor?.chain().focus().setLink({ href: url }).run(),
      unsetLink: () => editor?.chain().focus().unsetLink().run(),
      setFontFamily: (family: string) =>
        editor?.chain().focus().setFontFamily(family),
      undo: () => editor?.chain().undo().run(),
      redo: () => editor?.chain().redo().run(),
      copy: async () => {
        if (editor && !editor.state.selection.empty) {
          const { from, to } = editor.state.selection;
          // This preserves newlines and whitespace
          const selectedText = editor.state.doc.textBetween(from, to, '\n');
          try {
            await navigator.clipboard.writeText(selectedText);
            return true;
          } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = selectedText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
          }
        }
        return false;
      },
      cut: async () => {
        if (editor && !editor.state.selection.empty) {
          try {
            const selectedText = editor.state.doc.textBetween(
              editor.state.selection.from,
              editor.state.selection.to
            );
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(selectedText);
              editor.chain().focus().deleteSelection().run();
              return true;
            } else {
              // Fallback to execCommand for older browsers
              return document.execCommand('cut');
            }
          } catch (err) {
            console.warn('Clipboard access denied, trying fallback');
            return document.execCommand('cut');
          }
        }
        return false;
      },
      paste: async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText();
            if (text && editor) {
              editor.chain().focus().insertContent(text).run();
              return true;
            }
          }
        } catch (err) {
          console.warn('Clipboard access denied or not supported');
          // Fallback: Focus editor so user can use Ctrl+V
          if (editor) {
            editor.commands.focus();
          }
        }
        return false;
      },
    }),
    [editor]
  );

  return (
    <Box
      sx={{
        '--editor-bg': theme.palette.background.paper,
        '--editor-text': theme.palette.text.primary,
        '--app-bg': theme.palette.background.default,
        '--selection-bg':
          theme.palette.mode === 'dark'
            ? 'rgba(144, 202, 249, 0.3)'
            : 'rgba(25, 118, 210, 0.3)',
      }}
    >
      <Box>
        <Titlebar documentData={documentData ?? undefined} editor={editor} />
        <Formatbar commands={commands} editor={editor} fontSize={fontSize} />
      </Box>
      <Box
        sx={{
          minHeight: '80vh',
          width: 'min(700px, 90vw)',
          maxWidth: '700px',
          margin: '20px auto',
          padding: '20px',
          background: theme.palette.background.paper,
          borderRadius: '8px',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[2],
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          position: 'relative',
          overflowX: 'hidden',
          '&:focus-within': {
            borderColor: theme.palette.primary.main,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `${theme.shadows[4]}, 0 0 0 3px ${theme.palette.primary.main}40`
                : `${theme.shadows[2]}, 0 0 0 3px ${theme.palette.primary.main}20`,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'min(700px, 90vw)',
          maxWidth: '700px',
          margin: '0 auto 20px auto',
          padding: '16px 20px',
          background:
            theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4],
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: status === 'connected' ? '#10b981' : '#f59e0b',
              animation: status === 'connecting' ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
            }}
          >
            {status === 'connected' && users != null
              ? `${users.length} online • Group - ${documentData?.groupName}`
              : status === 'connecting'
              ? 'Connecting...'
              : 'Offline'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: currentUser.color,
              color: 'black',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
            }}
          >
            {currentUser.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Tiptap;
