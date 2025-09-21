import { useEditor, EditorContent } from "@tiptap/react";
import "../../../styles/components/DocumentEditor/Tiptap.css";
import { Box, Typography } from "@mui/material";
import { Formatbar } from "../Toolbars/Formatbar";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { ListKit } from "@tiptap/extension-list";
import Link from "@tiptap/extension-link";
import { TextStyle, Color, FontSize } from "@tiptap/extension-text-style";
import { Image } from "@tiptap/extension-image";
import { CharacterCount } from "@tiptap/extensions";
import { TableKit } from "@tiptap/extension-table";
// import { Pagination } from "tiptap-pagination-breaks";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import Highlight from "@tiptap/extension-highlight";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
  "#C3E2C2",
  "#EAECCC",
  "#AFC8AD",
  "#EEC759",
  "#9BB8CD",
  "#FF90BC",
  "#FFC0D9",
  "#DC8686",
  "#7ED7C1",
  "#F3EEEA",
  "#89B9AD",
  "#D0BFFF",
  "#FFF8C9",
  "#CBFFA9",
  "#9BABB8",
  "#E3F4F4",
];
const names = [
  "Lea Thompson",
  "Cyndi Lauper",
  "Tom Cruise",
  "Madonna",
  "Jerry Hall",
  "Joan Collins",
  "Winona Ryder",
  "Christina Applegate",
  "Alyssa Milano",
  "Molly Ringwald",
  "Ally Sheedy",
  "Debbie Harry",
  "Olivia Newton-John",
  "Elton John",
  "Michael J. Fox",
  "Axl Rose",
  "Emilio Estevez",
  "Ralph Macchio",
  "Rob Lowe",
  "Jennifer Grey",
  "Mickey Rourke",
  "John Cusack",
  "Matthew Broderick",
  "Justine Bateman",
  "Lisa Bonet",
];

const getRandomElement = (list: any) =>
  list[Math.floor(Math.random() * list.length)];

const getRandomColor = () => getRandomElement(colors);
const getRandomName = () => getRandomElement(names);

const getInitialUser = () => {
  return {
    name: getRandomName(),
    color: getRandomColor(),
  };
};

interface TiptapProps {
  ydoc: any;
  provider: any;
  room: any;
}

const Tiptap = ({ ydoc, provider, room }: TiptapProps) => {
  const [status, setStatus] = useState("connecting");
  const [currentUser, setCurrentUser] = useState(getInitialUser);

  const editor = useEditor({
    enableContentCheck: true,
    onContentError: ({ disableCollaboration }) => {
      disableCollaboration();
    },
    onCreate: ({ editor: currentEditor }) => {
      provider.on("synced", () => {
        if (currentEditor.isEmpty) {
          currentEditor.commands.setContent("");
        }
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
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
      TextStyle,
      Color,
      FontSize,
      ListKit,
      Image,
      Link.configure({
        openOnClick: true,
      }),
      // UndoRedo.configure({
      //   depth: 15,
      // }),
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

    content: "",
  });

  useEffect(() => {
    // Update status changes
    const statusHandler = (event: any) => {
      setStatus(event.status);
    };

    provider.on("status", statusHandler);

    return () => {
      provider.off("status", statusHandler);
    };
  }, [provider]);

  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      editor.chain().focus().updateUser(currentUser).run();
    }
  }, [editor, currentUser]);

  // Keep currentUser state for future AuthContext integration
  // setCurrentUser will be used when integrating with AuthContext

  if (!editor) {
    return null;
  }

  const commands = {
    toggleBold: () => editor?.chain().focus().toggleBold().run(),
    toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
    toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
    setTextAlign: (alignment: string) =>
      editor?.chain().focus().setTextAlign(alignment).run(),
    setColor: (color: string) => editor?.chain().setColor(color).run(),
    setFontSize: (size: string) => editor?.chain().setFontSize(size).run(),
    toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
    toggleOrderedList: () => editor?.chain().focus().toggleOrderedList().run(),
    insertImage: (url: string) =>
      editor?.chain().focus().setImage({ src: url }).run(),
    setLink: (url: string) =>
      editor?.chain().focus().setLink({ href: url }).run(),
    unsetLink: () => editor?.chain().focus().unsetLink().run(),
    undo: () => editor?.chain().undo().run(),
    redo: () => editor?.chain().redo().run(),
    copy: async () => {
      if (editor && !editor.state.selection.empty) {
        try {
          const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
          );
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(selectedText);
            return true;
          } else {
            // Fallback to execCommand for older browsers
            return document.execCommand("copy");
          }
        } catch (err) {
          console.warn("Clipboard access denied, trying fallback");
          return document.execCommand("copy");
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
            return document.execCommand("cut");
          }
        } catch (err) {
          console.warn("Clipboard access denied, trying fallback");
          return document.execCommand("cut");
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
        console.warn("Clipboard access denied or not supported");
        // Fallback: Focus editor so user can use Ctrl+V
        if (editor) {
          editor.commands.focus();
        }
      }
      return false;
    },
  };

  return (
    <Box>
      <Box>
        <Formatbar commands={commands} editor={editor} />
      </Box>
      <Box
        sx={{
          minHeight: "80vh",
          width: "min(700px, 90vw)",
          maxWidth: "700px",
          margin: "20px auto",
          padding: "20px",
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e1e5e9",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          position: "relative",
          "&:focus-within": {
            borderColor: "#1976d2",
            boxShadow:
              "0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(25, 118, 210, 0.2)",
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "min(700px, 90vw)",
          maxWidth: "700px",
          margin: "0 auto 20px auto",
          padding: "12px 16px",
          background: status === "connected" ? "#e8f5e8" : "#fff3cd",
          borderRadius: "8px",
          border: `1px solid ${status === "connected" ? "#4caf50" : "#ff9800"}`,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: status === "connected" ? "#4caf50" : "#ff9800",
              animation:
                status === "connecting" ? "pulse 1.5s infinite" : "none",
              "@keyframes pulse": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.5 },
                "100%": { opacity: 1 },
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: status === "connected" ? "#2e7d32" : "#e65100",
            }}
          >
            {status === "connected"
              ? `${editor.storage.collaborationCaret.users.length} user${
                  editor.storage.collaborationCaret.users.length >= 1 ? "" : "s"
                } online in room ${room}`
              : status === "connecting"
              ? "Connecting..."
              : "Offline"}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: currentUser.color,
            color: "black",
            textTransform: "none",
            fontWeight: 600,
            padding: "6px 12px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EditIcon fontSize="small" />
          {currentUser.name}
        </Box>
      </Box>
    </Box>
  );
};

export default Tiptap;
