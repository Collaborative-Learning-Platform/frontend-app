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
  IconButton,
  Collapse,
  Card,
  CardContent,
  ClickAwayListener,
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
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import {
  buttonGroupWrapper,
  desktopToolsWrapper,
  getAppBarStyling,
  getButtonGroupStyles,
  getMiniAppBarCardStyles,
  getMoreIconStyles,
  miniAppBarContentWrapper,
  responsiveLayoutWrapper,
  toolBarStyles,
} from "../../styles/components/DocumentEditor/Formatbar";
import {
  dividerStyles,
  docEditorToolbar,
  miniAppBarStyles,
} from "../../styles/components/DocumentEditor/common";

export const Formatbar = () => {
  const theme = useTheme();
  const buttonGroupStyles = getButtonGroupStyles(theme);
  const appBarStyles = getAppBarStyling(theme);
  const moreIconStyles = getMoreIconStyles(theme);
  const miniAppBarCardStyles = getMiniAppBarCardStyles(theme);
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
  const [selectedAlignment, setSelectedAlignment] = useState<string | null>(
    "Left"
  );
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedInsert, setSelectedInsert] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [miniAppBarOpen, setMiniAppBarOpen] = useState(false);

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

  return (
    <Box sx={docEditorToolbar}>
      <AppBar position="static" elevation={0} sx={appBarStyles}>
        <Toolbar sx={toolBarStyles} variant="dense">
          <Box sx={responsiveLayoutWrapper}>
            {/* Text Formatting Group */}
            <Box sx={buttonGroupWrapper}>
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

              <Divider orientation="vertical" flexItem sx={dividerStyles} />

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

              <Divider orientation="vertical" flexItem sx={dividerStyles} />
              {/* More Options - Mobile only */}
              <ClickAwayListener onClickAway={() => setMiniAppBarOpen(false)}>
                <Box sx={miniAppBarStyles}>
                  <Tooltip title="More options">
                    <IconButton
                      size="small"
                      onClick={() => setMiniAppBarOpen(!miniAppBarOpen)}
                      sx={moreIconStyles}
                    >
                      {miniAppBarOpen ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Collapse
                    in={miniAppBarOpen}
                    timeout={{ enter: 500, exit: 400 }}
                    easing={{
                      enter: "cubic-bezier(0.4, 0, 0.2, 1)",
                      exit: "ease-in-out",
                    }}
                  >
                    <Card sx={miniAppBarCardStyles}>
                      <CardContent>
                        <Box sx={miniAppBarContentWrapper}>
                          {/* Insert Tools */}
                          <Box sx={buttonGroupWrapper}>
                            <Tooltip title="Insert">
                              <ToggleButtonGroup
                                aria-label="inserts"
                                value={selectedInsert}
                                onChange={handleSelectedInsert}
                                exclusive
                                size="small"
                                sx={buttonGroupStyles}
                              >
                                <ToggleButton
                                  value="Image"
                                  aria-label="insert-image"
                                >
                                  <InsertPhotoIcon />
                                </ToggleButton>
                                <ToggleButton
                                  value="Hyperlink"
                                  aria-label="insert-hyperlink"
                                >
                                  <AddLinkIcon />
                                </ToggleButton>
                                <ToggleButton
                                  value="Table"
                                  aria-label="insert-table"
                                >
                                  <TableChartIcon />
                                </ToggleButton>
                              </ToggleButtonGroup>
                            </Tooltip>
                          </Box>

                          {/* Edit Actions */}
                          <Box>
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

                          {/* Lists */}
                          <Box>
                            <Tooltip title="Lists">
                              <ToggleButtonGroup
                                aria-label="lists"
                                value={selectedList}
                                onChange={handleSelectedList}
                                exclusive
                                size="small"
                                sx={buttonGroupStyles}
                              >
                                <ToggleButton
                                  value="Bullets"
                                  aria-label="bullets"
                                >
                                  <FormatListBulletedIcon />
                                </ToggleButton>
                                <ToggleButton
                                  value="Numbering"
                                  aria-label="numbering"
                                >
                                  <FormatListNumberedIcon />
                                </ToggleButton>
                              </ToggleButtonGroup>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Collapse>
                </Box>
              </ClickAwayListener>

              {/* Desktop Tools */}
              <Box sx={desktopToolsWrapper}>
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

                <Divider orientation="vertical" flexItem sx={dividerStyles} />

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

                <Divider orientation="vertical" flexItem sx={dividerStyles} />

                {/* Insert Tools */}
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

                <Divider orientation="vertical" flexItem sx={dividerStyles} />

                {/* Edit Actions */}
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
