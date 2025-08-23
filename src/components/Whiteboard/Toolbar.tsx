import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  toggleButtonClasses,
  toggleButtonGroupClasses,
} from "@mui/material";
import DrawIcon from "@mui/icons-material/Draw";
import ClearIcon from "@mui/icons-material/Clear";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import TitleIcon from "@mui/icons-material/Title";
import InterestsIcon from "@mui/icons-material/Interests";
import PaletteIcon from "@mui/icons-material/Palette";
import LineWeightIcon from "@mui/icons-material/LineWeight";
import { styled } from "@mui/material";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: "1rem",
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
    },
  [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
    {
      borderLeft: `1px solid ${
        (theme.vars || theme).palette.action.disabledBackground
      }`,
    },
}));

interface ToolbarProps {
  selectedTool: String | null;
  onToolChange: (_event: React.MouseEvent<HTMLElement>, tool: String) => void;
}

const Toolbar = (Props: ToolbarProps) => {
  return (
    <>
      <Stack direction="row" spacing={0.5}>
        <StyledToggleButtonGroup
          color="primary"
          aria-label="whiteboard tools"
          value={Props.selectedTool}
          onChange={Props.onToolChange}
          exclusive
          sx={{
            "& .MuiToggleButton-root": {
              border: "none",
              borderRadius: 2,
              padding: "12px",
              margin: "0 2px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                transform: "translateY(-1px)",
              },
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            },
          }}
        >
          <ToggleButton value="Draw" aria-label="draw" title="Draw">
            <DrawIcon />
          </ToggleButton>
          <ToggleButton value="Color" aria-label="color" title="Color Palette">
            <PaletteIcon />
          </ToggleButton>
          <ToggleButton
            value="Thickness"
            aria-label="thickness"
            title="Line Weight"
          >
            <LineWeightIcon />
          </ToggleButton>
          <ToggleButton value="Shapes" aria-label="shapes" title="Add Shapes">
            <InterestsIcon />
          </ToggleButton>
          <ToggleButton value="Text" aria-label="text" title="Add Text">
            <TitleIcon />
          </ToggleButton>
          <ToggleButton value="Note" aria-label="note" title="Sticky Notes">
            <StickyNote2Icon />
          </ToggleButton>
          <ToggleButton
            value="Clear"
            aria-label="clear"
            title="Clear Board"
            sx={{
              "&.MuiToggleButton-root": {
                color: "error.main",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.08)",
                },
                "&.Mui-selected": {
                  backgroundColor: "error.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "error.dark",
                  },
                },
              },
            }}
          >
            <ClearIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Stack>
    </>
  );
};

export default Toolbar;
