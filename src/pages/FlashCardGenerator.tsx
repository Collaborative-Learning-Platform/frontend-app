import {
  Box,
  useTheme,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  Stack,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  IconButton,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export const FlashCardGenerator = () => {
  const theme = useTheme();
  const numberOfCardsOptions = ["Five", "Ten", "Twenty"];
  const [numberOfCards, SetNumberOfCards] = useState("Ten");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
      setUploadedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      const allowedTypes = [".pdf", ".doc", ".docx", ".txt", ".md"];
      const fileExtension = file.name
        .toLowerCase()
        .substr(file.name.lastIndexOf("."));

      if (allowedTypes.includes(fileExtension)) {
        console.log("File dropped:", file.name);
        setUploadedFile(file);
      } else {
        alert("Please upload a valid file type: PDF, DOC, DOCX, TXT, or MD");
      }
    }
  };

  const handleChangeCardNumber = (event: SelectChangeEvent) => {
    const newCardNumber = event.target.value;
    SetNumberOfCards(newCardNumber);
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert("Please upload a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("numberOfCards", numberOfCards);

    try {
      // Dummy API call - replace with actual backend endpoint
      console.log("Submitting to backend:", {
        file: uploadedFile.name,
        numberOfCards: numberOfCards,
      });

      // const response = await fetch('/api/generate-flashcards', {
      //   method: 'POST',
      //   body: formData
      // });

      alert(`Generating ${numberOfCards} flashcards from ${uploadedFile.name}`);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("Error generating flashcards. Please try again.");
    }
  };

  const handleRemoveFile = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadedFile(null);
  };

  const handleUploadAreaClick = (event: React.MouseEvent) => {
    if (uploadedFile) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box>
      <Box sx={{ mb: theme.spacing(3) }}>
        <Typography variant="h5" fontWeight="bold">
          Generate FlashCards
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Transform your study materials into flashcards!
        </Typography>
      </Box>
      <Card>
        <CardHeader
          avatar={<FileUploadIcon />}
          title="Upload Study Material"
          subheader="Upload the files you want us to generate the flashcards for"
        />
        <CardContent>
          <label
            htmlFor={uploadedFile ? undefined : "file-upload"}
            style={{
              display: "block",
              cursor: uploadedFile ? "default" : "pointer",
            }}
            onClick={handleUploadAreaClick}
          >
            <Box
              sx={{
                border: `2px dashed`,
                borderColor: isDragOver
                  ? theme.palette.primary.main
                  : theme.palette.grey[300],
                borderRadius: theme.shape.borderRadius,
                p: theme.spacing(6), // Increased from 4 to 6 for more height
                py: theme.spacing(8), // Extra vertical padding for more height
                minHeight: "200px", // Added minimum height for better proportions
                textAlign: "center",
                transition: theme.transitions.create(
                  ["border-color", "background-color"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                width: "100%",
                boxSizing: "border-box",
                display: "block",
                backgroundColor: isDragOver
                  ? theme.palette.primary.light
                  : "transparent",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.background.paper,
                },
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                style={visuallyHidden}
                accept=".pdf,.doc,.docx,.txt,.md"
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center", // Added to center content vertically
                  gap: theme.spacing(3), // Increased from 2 to 3 for more spacing
                  height: "100%", // Take full height of parent
                }}
              >
                {uploadedFile ? (
                  // Show uploaded file details
                  <Box>
                    <CheckCircleIcon
                      sx={{
                        fontSize: theme.spacing(6), // 48px equivalent
                        color: "success.main",
                      }}
                    />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color="success.main"
                      >
                        File uploaded successfully!
                      </Typography>
                      <Typography variant="body2" sx={{ mt: theme.spacing(1) }}>
                        {uploadedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(uploadedFile.size)}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={handleRemoveFile}
                      color="error"
                      sx={{ mt: theme.spacing(1) }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  // Show upload prompt
                  <Box>
                    <DescriptionIcon
                      sx={{
                        fontSize: theme.spacing(6), // 48px equivalent
                        color: "text.secondary",
                      }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Click to upload or drag and drop
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PDF, DOC, DOCX, TXT, MD (max 50MB)
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </label>
        </CardContent>
      </Card>
      <Card sx={{ mt: theme.spacing(3) }}>
        <CardHeader
          avatar={<SettingsSuggestIcon />}
          title="Flashcard Settings"
          subheader="Customize how your flashcards will be generated"
        />
        <Box>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
                mb: theme.spacing(2),
              }}
            >
              <Stack gap={2}>
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={numberOfCards}
                    onChange={handleChangeCardNumber}
                    displayEmpty
                    inputProps={{ "aria-label": "Card Number" }}
                  >
                    {numberOfCardsOptions.map((cardNumber, index) => (
                      <MenuItem key={index} value={cardNumber}>
                        {cardNumber}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Select the number of Cards</FormHelperText>
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleSubmit}
                  disabled={!uploadedFile}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    "&:disabled": {
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.text.disabled,
                    },
                  }}
                >
                  Generate Flashcards
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};
