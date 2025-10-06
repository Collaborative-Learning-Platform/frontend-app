import { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Button,
  Divider,
  Tooltip,
  useTheme,
  Popover,
  Typography,
  Autocomplete,
  TextField,
} from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AddLinkIcon from '@mui/icons-material/AddLink';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CopyIcon from '@mui/icons-material/ContentCopy';
import CutIcon from '@mui/icons-material/ContentCut';
import PasteIcon from '@mui/icons-material/ContentPaste';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { getButtonGroupStyles } from '../../../styles/components/DocumentEditor/Formatbar';
import {
  dividerStyles,
  popOverBoxSize,
} from '../../../styles/components/DocumentEditor/common';
import { MuiColorInput } from 'mui-color-input';
import { Editor } from '@tiptap/react';

type FormatbarProps = {
  commands: {
    toggleBold: () => boolean;
    toggleItalic: () => boolean;
    toggleUnderline: () => boolean;
    setTextAlign: (alignment: string) => boolean;
    setColor: (color: string) => boolean;
    setFontSize: (size: string) => boolean;
    toggleBulletList: () => boolean;
    toggleOrderedList: () => boolean;
    insertImage: (url: string) => boolean;
    setLink: (url: string) => boolean;
    unsetLink: () => boolean;
    undo: () => boolean;
    redo: () => boolean;
    copy: () => Promise<boolean>;
    cut: () => Promise<boolean>;
    paste: () => Promise<boolean>;
    setFontFamily: (fontFamily: string) => void; // Added setFontFamily to commands
  };
  editor: Editor;
  fontSize: string;
};
export const Formatbar: React.FC<FormatbarProps> = ({
  commands,
  editor,
  fontSize,
}) => {
  const theme = useTheme();
  const buttonGroupStyles = getButtonGroupStyles(theme);

  // State for editor-driven UI that needs to update on editor changes
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
  const [selectedAlignment, setSelectedAlignment] = useState<string>('Left');
  const [selectedList, setSelectedList] = useState<string | null>(null);

  // Keep these as React state since they're UI-only (not part of document state)
  const [selectedInsert, setSelectedInsert] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  // Get current color from editor state instead of React state
  const [color, setColor] = useState<string>(theme.palette.text.primary);
  const [size, setSize] = useState<string>(fontSize);

  // Font family state
  const [fontFamily, setFontFamily] = useState<string>(
    editor.getAttributes('textStyle').fontFamily || 'Gill Sans'
  );

  // Update UI state when editor state changes
  useEffect(() => {
    if (!editor) return;

    const updateUIState = () => {
      // Update format state
      const formats = [
        ...(editor.isActive('bold') ? ['Bold'] : []),
        ...(editor.isActive('italic') ? ['Italic'] : []),
        ...(editor.isActive('underline') ? ['Underline'] : []),
      ];
      setSelectedFormat(formats);

      // Update alignment state
      const alignment = editor.isActive({ textAlign: 'left' })
        ? 'Left'
        : editor.isActive({ textAlign: 'center' })
        ? 'Center'
        : editor.isActive({ textAlign: 'right' })
        ? 'Right'
        : 'Left';
      setSelectedAlignment(alignment);

      // Update list state
      const list = editor.isActive('bulletList')
        ? 'Bullets'
        : editor.isActive('orderedList')
        ? 'Numbering'
        : null;
      setSelectedList(list);

      // Update color and size state
      const currentColor =
        editor.getAttributes('textStyle').color || theme.palette.text.primary;
      const currentSize =
        editor.getAttributes('textStyle').fontSize || fontSize;
      setColor(currentColor);
      setSize(currentSize);

      // Update font family state
      const currentFontFamily =
        editor.getAttributes('textStyle').fontFamily || 'Gill Sans';
      setFontFamily(currentFontFamily);

      // Update font size input to match current size (only if not actively typing)
      if (!sizeAnchorEl && fontSize) {
        const sizeNumber =
          parseInt(currentSize.replace('px', '')) ||
          parseInt(fontSize.replace('px', ''));
        setFontSizeInput(sizeNumber.toString());
      }
    };

    // Update immediately
    updateUIState();

    // Listen for editor updates
    editor.on('selectionUpdate', updateUIState);
    editor.on('transaction', updateUIState);

    // Cleanup listeners
    return () => {
      editor.off('selectionUpdate', updateUIState);
      editor.off('transaction', updateUIState);
    };
  }, [editor]);

  const [newColor, setNewColor] = useState<string>('#000000');
  const [fontSizeInput, setFontSizeInput] = useState<string>('');
  const [sizeAnchorEl, setSizeAnchorEl] = useState<HTMLElement | null>(null);
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);

  // Link state
  const [linkAnchorEl, setLinkAnchorEl] = useState<HTMLElement | null>(null);
  const [linkUrl, setLinkUrl] = useState<string>('');

  const handleSelectedFormat = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedFormat: string[]
  ) => {
    // Find what changed by comparing with current state
    const added = updatedSelectedFormat.filter(
      (item) => !selectedFormat.includes(item)
    );
    const removed = selectedFormat.filter(
      (item) => !updatedSelectedFormat.includes(item)
    );

    // Handle newly added formats
    added.forEach((format) => {
      switch (format) {
        case 'Bold':
          commands.toggleBold();
          break;
        case 'Italic':
          commands.toggleItalic();
          break;
        case 'Underline':
          commands.toggleUnderline();
          break;
      }
    });

    // Handle removed formats (toggle them off)
    removed.forEach((format) => {
      switch (format) {
        case 'Bold':
          commands.toggleBold();
          break;
        case 'Italic':
          commands.toggleItalic();
          break;
        case 'Underline':
          commands.toggleUnderline();
          break;
      }
    });
  };

  const handleSelectedAlignment = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedAlignment: string
  ) => {
    // No need to setSelectedAlignment - reading directly from editor state
    if (updatedSelectedAlignment) {
      commands.setTextAlign(updatedSelectedAlignment.toLowerCase());
    }
  };

  const handleSelectedList = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedList: string
  ) => {
    console.log(updatedSelectedList);
    setSelectedList(updatedSelectedList);
  };

  const handleBulletsClick = () => {
    commands.toggleBulletList();
  };

  const handleNumberingClick = () => {
    commands.toggleOrderedList();
  };

  const handleSelectedInsert = (
    event: React.MouseEvent<HTMLElement>,
    updatedSelectedInsert: string
  ) => {
    setSelectedInsert(updatedSelectedInsert);
    if (updatedSelectedInsert == 'Image') {
      // Add:
      //1.FileUpload Functionality to s3/Cloudinary
      //2.Get link to uploaded file from s3/Cloudinary
      //3.Display the fetched image from Cloudinary
      //Also you can do signed Cloudfront URLs and get the benefit of caching.
    } else if (updatedSelectedInsert == 'Hyperlink') {
      // Open link input popover
      setLinkAnchorEl(event.currentTarget);
      // Pre-fill with existing link if text is already linked
      const currentLink = editor.getAttributes('link').href || '';
      setLinkUrl(currentLink);
    }
    // Reset selection after handling
    setSelectedInsert(null);
  };

  const handleSelectedStyle = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedStyle: string
  ) => {
    setSelectedStyle(updatedSelectedStyle);
  };

  const handleColorChange = (newColor: string) => {
    setNewColor(newColor);
    commands.setColor(newColor);
  };

  const handleFontSizeChange = (fontSize?: string) => {
    // If fontSize is provided, use it directly
    if (fontSize) {
      commands.setFontSize(fontSize);
      return;
    }

    // Otherwise, use fontSizeInput with validation
    if (fontSizeInput && fontSizeInput.trim() !== '') {
      const numValue = parseInt(fontSizeInput);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 72) {
        const validFontSize = `${numValue}px`;
        commands.setFontSize(validFontSize);
      }
    }
  };

  const handleColorButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchorEl(event.currentTarget);
    // Initialize newColor with current editor color when opening popover
    setNewColor(color);
  };

  const handleSizeButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setSizeAnchorEl(event.currentTarget);
    setFontSizeInput(pxToNumber(size).toString());
  };

  const handleColorPopoverClose = () => {
    handleFontSizeChange();
    setColorAnchorEl(null);
    setSelectedStyle(null);
  };

  // Link handlers
  const handleLinkPopoverClose = () => {
    setLinkAnchorEl(null);
    setLinkUrl('');
  };

  const handleAddLink = () => {
    if (linkUrl.trim()) {
      // Add http:// if no protocol specified
      const url =
        linkUrl.startsWith('http://') || linkUrl.startsWith('https://')
          ? linkUrl
          : `https://${linkUrl}`;
      commands.setLink(url);
    } else {
      // If empty URL, remove the link
      commands.unsetLink();
    }
    handleLinkPopoverClose();
  };

  const handleRemoveLink = () => {
    commands.unsetLink();
    handleLinkPopoverClose();
  };

  const handleTextPopoverClose = () => {
    handleFontSizeChange();
    setSizeAnchorEl(null);
    setSelectedStyle(null);
  };

  // Helper functions for font size conversion
  const pxToNumber = (pxString: string): number => {
    return parseInt(pxString.replace('px', '')) || 14;
  };

  const handleUndo = () => {
    commands.undo();
  };

  const handleRedo = () => {
    commands.redo();
  };

  const handleCopy = async () => {
    await commands.copy();
  };

  const handleCut = async () => {
    await commands.cut();
  };

  const handlePaste = async () => {
    await commands.paste();
  };

  const predefinedColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#424242' },
    { name: 'Gray', value: '#757575' },
    { name: 'Light Gray', value: '#BDBDBD' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Brown', value: '#795548' },
    { name: 'Red', value: '#F44336' },
    { name: 'Pink', value: '#E91E63' },
    { name: 'Purple', value: '#9C27B0' },
    { name: 'Deep Purple', value: '#673AB7' },
    { name: 'Indigo', value: '#3F51B5' },
    { name: 'Blue', value: '#2196F3' },
    { name: 'Light Blue', value: '#03A9F4' },
    { name: 'Cyan', value: '#00BCD4' },
    { name: 'Teal', value: '#009688' },
    { name: 'Green', value: '#4CAF50' },
    { name: 'Light Green', value: '#8BC34A' },
    { name: 'Lime', value: '#CDDC39' },
    { name: 'Yellow', value: '#FFEB3B' },
    { name: 'Amber', value: '#FFC107' },
    { name: 'Orange', value: '#FF9800' },
    { name: 'Deep Orange', value: '#FF5722' },
    { name: 'Maroon', value: '#800000' },
    { name: 'Navy', value: '#000080' },
  ];

  const fontSizeOptionsList = [
    '2',
    '4',
    '6',
    '8',
    '9',
    '10',
    '11',
    '12',
    '14',
    '16',
    '18',
    '20',
    '22',
    '24',
    '26',
    '28',
    '36',
    '48',
    '72',
  ];

  const commandsWithFontFamily = {
    ...commands,
    setFontFamily: (fontFamily: string) => {
      console.log('Applying font family:', fontFamily);
      editor.chain().focus().setFontFamily(fontFamily).run();
    },
  };

  const fontFamilies = [
    'Helvetica',
    'Verdana',
    'Tahoma',
    'Gill Sans',
    'Garamond',
    'Courier New',
    'Lucida Console',
    'Consolas',
    'Comic Sans MS',
    'Brush Script MT',
    'Impact',
    'Papyrus',
  ];

  return (
    <Box sx={{ width: '100%', flexGrow: 1, padding: 0, overflow: 'visible' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          width: '100%',
          background: theme.palette.background.paper,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar
          sx={{
            minHeight: 56, // Single height for all devices
            px: 3,
            py: 1,
            overflow: 'visible',
          }}
          variant="dense"
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center', // Center alignment for single row
              gap: { xs: 1, md: 2 }, // Consistent gaps
              flexWrap: 'wrap', // Traditional wrapping
              justifyContent: 'flex-start',
            }}
          >
            {/* Text formatting */}
            <Tooltip title="Text formatting">
              <ToggleButtonGroup
                aria-label="text formatting"
                value={selectedFormat}
                onChange={handleSelectedFormat}
                size="small"
                sx={{
                  ...buttonGroupStyles,
                }}
              >
                <ToggleButton value="Bold" aria-label="bold">
                  <FormatBoldIcon />
                </ToggleButton>
                <ToggleButton value="Italic" aria-label="italic">
                  <FormatItalicIcon />
                </ToggleButton>
                <ToggleButton value="Underline" aria-label="underline">
                  <FormatUnderlinedIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                ...dividerStyles,
              }}
            />
            {/* Font Family Selector */}
            <Autocomplete
              options={fontFamilies}
              value={fontFamily}
              onChange={(_, newValue) => {
                if (newValue) {
                  console.log('Selected font family:', newValue);
                  setFontFamily(newValue);
                  commandsWithFontFamily.setFontFamily(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Font Family"
                  variant="outlined"
                  size="small"
                />
              )}
              sx={{ width: 200, marginLeft: 2 }}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                ...dividerStyles,
              }}
            />
            {/* Text Color and Style Tools */}
            <Tooltip title="Text style">
              <ToggleButtonGroup
                size="small"
                exclusive
                aria-label="text formatting"
                value={selectedStyle}
                onChange={handleSelectedStyle}
                sx={{
                  ...buttonGroupStyles,
                }}
              >
                <ToggleButton
                  value="font-color"
                  aria-label="font-color"
                  onClick={handleColorButtonClick}
                >
                  <FormatColorTextIcon />
                </ToggleButton>
                <ToggleButton
                  value="font-size"
                  aria-label="font-size"
                  onClick={handleSizeButtonClick}
                >
                  <TextFieldsIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
            {/* Color Popover */}
            <Popover
              open={Boolean(colorAnchorEl)}
              anchorEl={colorAnchorEl}
              onClose={handleColorPopoverClose}
              disableScrollLock={true}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Box sx={popOverBoxSize}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Quick Colors
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: 0.5,
                    mb: 2,
                    overflow: 'hidden',
                    width: '100%', // Use full container width
                    justifyItems: 'center', // Center items in grid cells
                  }}
                >
                  {predefinedColors.map((colorOption) => (
                    <Box
                      key={colorOption.value}
                      onClick={() => {
                        handleColorChange(colorOption.value);
                      }}
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: colorOption.value,
                        border:
                          color === colorOption.value
                            ? '2px solid #1976d2'
                            : '1px solid #ccc',
                        borderRadius: 0.5,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexGrow: 1,
                        flexShrink: 0, // Prevent shrinking
                        position: 'relative', // Fixed positioning context
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: 1,
                          overflow: 'hidden',
                          zIndex: 1, // Ensure hover state stays on top
                        },
                      }}
                      title={colorOption.name}
                    />
                  ))}
                </Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Custom Color
                </Typography>
                <MuiColorInput
                  format="hex"
                  value={newColor}
                  onChange={handleColorChange}
                  size="small"
                  sx={{ width: '100%' }}
                />
              </Box>
            </Popover>
            {/* TextSize Popover */}
            <Popover
              open={Boolean(sizeAnchorEl)}
              anchorEl={sizeAnchorEl}
              onClose={handleTextPopoverClose}
              disableScrollLock={true}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Box sx={{ ...popOverBoxSize, py: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Font Size
                </Typography>
                <Box sx={{ px: 0, display: 'flex', justifyContent: 'left' }}>
                  <Autocomplete
                    value={null} // Don't control the value, let it be free
                    onChange={(_, newValue) => {
                      if (newValue) {
                        const fontSize = `${newValue}px`;
                        handleFontSizeChange(fontSize);
                        setFontSizeInput(newValue); // Update local state
                      }
                    }}
                    defaultValue={size}
                    inputValue={fontSizeInput}
                    onInputChange={(_, newInputValue) => {
                      setFontSizeInput(newInputValue); // Always update local state

                      // Only update editor if it's a valid number
                      const numValue = parseInt(newInputValue);
                      if (!isNaN(numValue) && numValue > 0 && numValue <= 300) {
                        const fontSize = `${numValue}px`;
                        handleFontSizeChange(fontSize);
                      }
                    }}
                    options={fontSizeOptionsList}
                    freeSolo
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Size"
                        type="number"
                        inputProps={{
                          ...params.inputProps,
                          min: 1,
                          max: 72,
                          step: 1,
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleTextPopoverClose();
                          }
                        }}
                        sx={{
                          '& input': {
                            textAlign: 'center',
                          },
                        }}
                      />
                    )}
                    sx={{ width: 120 }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    color: 'text.secondary',
                    display: 'block',
                    textAlign: 'left',
                  }}
                >
                  (1-72)
                </Typography>
              </Box>
            </Popover>

            {/* Link Popover */}
            <Popover
              open={Boolean(linkAnchorEl)}
              anchorEl={linkAnchorEl}
              onClose={handleLinkPopoverClose}
              disableScrollLock={true}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Box sx={{ ...popOverBoxSize, py: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Add Link
                </Typography>
                <TextField
                  type="url"
                  label="URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  fullWidth
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLink();
                    }
                  }}
                  sx={{ mb: 2 }}
                />
                <Box
                  sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}
                >
                  <Button size="small" onClick={handleLinkPopoverClose}>
                    Cancel
                  </Button>
                  {editor.getAttributes('link').href && (
                    <Button
                      size="small"
                      color="error"
                      onClick={handleRemoveLink}
                    >
                      Remove
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddLink}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Popover>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                ...dividerStyles,
              }}
            />
            {/* Alignment Group */}
            <Tooltip title="Text alignment">
              <ToggleButtonGroup
                aria-label="alignment"
                value={selectedAlignment}
                onChange={handleSelectedAlignment}
                exclusive
                size="small"
                sx={{
                  ...buttonGroupStyles,
                }}
              >
                <ToggleButton value="Left" aria-label="align-left">
                  <FormatAlignLeftIcon />
                </ToggleButton>
                <ToggleButton value="Center" aria-label="align-center">
                  <FormatAlignCenterIcon />
                </ToggleButton>
                <ToggleButton value="Right" aria-label="align-right">
                  <FormatAlignRightIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                ...dividerStyles,
              }}
            />
            {/* Lists Group */}
            <Tooltip title="Lists">
              <ToggleButtonGroup
                aria-label="lists"
                value={selectedList}
                onChange={handleSelectedList}
                exclusive
                size="small"
                sx={{
                  ...buttonGroupStyles,
                }}
              >
                <ToggleButton
                  value="Bullets"
                  aria-label="bullets"
                  onClick={handleBulletsClick}
                >
                  <FormatListBulletedIcon />
                </ToggleButton>
                <ToggleButton
                  value="Numbering"
                  aria-label="numbering"
                  onClick={handleNumberingClick}
                >
                  <FormatListNumberedIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                ...dividerStyles,
              }}
            />
            {/* Insert Tools */}
            <Tooltip title="Insert">
              <ToggleButtonGroup
                aria-label="inserts"
                value={selectedInsert}
                onChange={handleSelectedInsert}
                exclusive
                size="small"
                sx={{
                  ...buttonGroupStyles,
                }}
              >
                <ToggleButton value="Image" aria-label="insert-image">
                  <InsertPhotoIcon />
                </ToggleButton>
                <ToggleButton value="Hyperlink" aria-label="insert-hyperlink">
                  <AddLinkIcon />
                </ToggleButton>
                <ToggleButton value="Table" aria-label="insert-table">
                  <TableChartOutlinedIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                ...dividerStyles,
              }}
            />
            {/* Edit Actions */}
            <Tooltip title="Edit actions">
              <ButtonGroup
                variant="outlined"
                size="small"
                sx={{
                  ...buttonGroupStyles,
                }}
              >
                <Button aria-label="undo" onClick={handleUndo}>
                  <UndoIcon />
                </Button>
                <Button aria-label="redo" onClick={handleRedo}>
                  <RedoIcon />
                </Button>
                <Button aria-label="copy" onClick={handleCopy}>
                  <CopyIcon />
                </Button>
                <Button aria-label="cut" onClick={handleCut}>
                  <CutIcon />
                </Button>
                <Button aria-label="paste" onClick={handlePaste}>
                  <PasteIcon />
                </Button>
              </ButtonGroup>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
