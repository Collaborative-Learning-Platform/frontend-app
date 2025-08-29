import { useState } from "react";
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
} from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AddLinkIcon from "@mui/icons-material/AddLink";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CopyIcon from "@mui/icons-material/ContentCopy";
import PasteIcon from "@mui/icons-material/ContentPaste";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import TableChartIcon from "@mui/icons-material/TableChart";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";

export const Formatbar = () => {
  const theme = useTheme();
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
  const [selectedAlignment, setSelectedAlignment] = useState<string | null>(
    "Left"
  );
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedInsert, setSelectedInsert] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleSelectedFormat = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedFormat: string[]
  ) => {
    setSelectedFormat(updatedSelectedFormat);
  };

  const handleSelectedAlignment = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedAlignment: string
  ) => {
    setSelectedAlignment(updatedSelectedAlignment);
  };

  const handleSelectedList = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedList: string
  ) => {
    setSelectedList(updatedSelectedList);
  };

  const handleSelectedInsert = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedInsert: string
  ) => {
    setSelectedInsert(updatedSelectedInsert);
  };

  const handleSelectedStyle = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedStyle: string
  ) => {
    setSelectedStyle(updatedSelectedStyle);
  };

  const buttonGroupStyles = {
    "& .MuiToggleButton-root, & .MuiButton-root": {
      minWidth: 40,
      height: 36,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      color: theme.palette.text.secondary,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(0,0,0,0.2)"
          : "rgba(255,255,255,0.8)",
      backdropFilter: "blur(8px)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
        borderColor: "primary.main",
        color: "primary.main",
        transform: "translateY(-1px)",
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 2px 8px rgba(0,0,0,0.4)`
            : `0 2px 8px rgba(0,0,0,0.1)`,
      },
      "&.Mui-selected": {
        backgroundColor: "primary.main",
        color: theme.palette.primary.contrastText,
        borderColor: "primary.main",
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 2px 8px rgba(0,0,0,0.5)`
            : `0 2px 8px rgba(0,0,0,0.15)`,
        "&:hover": {
          backgroundColor: "primary.dark",
          color: theme.palette.primary.contrastText,
        },
      },
      "& .MuiSvgIcon-root": {
        fontSize: 18,
      },
    },
    gap: 0.5,
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          width: "100%",
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
              : `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ minHeight: 56, px: 3, py: 1 }} variant="dense">
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              flexWrap: { xs: "wrap", lg: "nowrap" },
              justifyContent: { xs: "flex-start", lg: "space-between" },
            }}
          >
            {/* Text Formatting Group */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Tooltip title="Text formatting">
                <ToggleButtonGroup
                  aria-label="text formatting"
                  value={selectedFormat}
                  onChange={handleSelectedFormat}
                  size="small"
                  sx={buttonGroupStyles}
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
                sx={{ mx: 0.5, height: 24 }}
              />

              {/* Text Color and Style Tools */}
              <Tooltip title="Text style">
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  aria-label="text formatting"
                  value={selectedStyle}
                  onChange={handleSelectedStyle}
                  sx={buttonGroupStyles}
                >
                  <ToggleButton value="font-color" aria-label="font-color">
                    <FormatColorTextIcon />
                  </ToggleButton>
                  <ToggleButton value="font-size" aria-label="font-size">
                    <TextFieldsIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Tooltip>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 0.5, height: 24 }}
              />

              {/* Alignment Group */}
              <Tooltip title="Text alignment">
                <ToggleButtonGroup
                  aria-label="alignment"
                  value={selectedAlignment}
                  onChange={handleSelectedAlignment}
                  exclusive
                  size="small"
                  sx={buttonGroupStyles}
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
                sx={{ mx: 0.5, height: 24 }}
              />

              {/* Lists Group */}
              <Tooltip title="Lists">
                <ToggleButtonGroup
                  aria-label="lists"
                  value={selectedList}
                  onChange={handleSelectedList}
                  exclusive
                  size="small"
                  sx={buttonGroupStyles}
                >
                  <ToggleButton value="Bullets" aria-label="bullets">
                    <FormatListBulletedIcon />
                  </ToggleButton>
                  <ToggleButton value="Numbering" aria-label="numbering">
                    <FormatListNumberedIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Tooltip>
            </Box>

            {/* Right Side Groups */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Insert Tools Group */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 0.5, height: 24 }}
                />

                <Tooltip title="Insert">
                  <ToggleButtonGroup
                    aria-label="inserts"
                    value={selectedInsert}
                    onChange={handleSelectedInsert}
                    exclusive
                    size="small"
                    sx={buttonGroupStyles}
                  >
                    <ToggleButton value="Image" aria-label="insert-image">
                      <InsertPhotoIcon />
                    </ToggleButton>
                    <ToggleButton
                      value="Hyperlink"
                      aria-label="insert-hyperlink"
                    >
                      <AddLinkIcon />
                    </ToggleButton>
                    <ToggleButton value="Table" aria-label="insert-table">
                      <TableChartIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Tooltip>
              </Box>

              {/* Edit Actions Group */}
              <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 0.5, height: 24 }}
                />

                <Tooltip title="Edit actions">
                  <ButtonGroup
                    variant="outlined"
                    size="small"
                    sx={buttonGroupStyles}
                  >
                    <Button aria-label="undo">
                      <UndoIcon />
                    </Button>
                    <Button aria-label="redo">
                      <RedoIcon />
                    </Button>
                    <Button aria-label="copy">
                      <CopyIcon />
                    </Button>
                    <Button aria-label="paste">
                      <PasteIcon />
                    </Button>
                  </ButtonGroup>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
