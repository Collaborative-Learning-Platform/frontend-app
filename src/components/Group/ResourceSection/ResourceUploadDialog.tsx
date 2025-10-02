import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Chip,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  CloudUpload,
  Close as CloseIcon,
  AttachFile,
  Link as LinkIcon,
  AccessTime
} from '@mui/icons-material';
import type { Resource } from './types';
import { PREDEFINED_TAGS } from './utils';

interface ResourceUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (resource: Partial<Resource>) => void;
  uploading: boolean;
  uploadProgress: number;
}

const ResourceUploadDialog: React.FC<ResourceUploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  uploading,
  uploadProgress
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<number | ''>('');
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!name) setName(file.name);
    }
  };

  const handleSubmit = () => {
    if (uploadType === 'file' && !selectedFile) return;
    if (uploadType === 'link' && !linkUrl) return;

    const estimatedCompletionTime = estimatedTime 
      ? timeUnit === 'hours' ? Number(estimatedTime) * 60 : Number(estimatedTime)
      : undefined;

    const resourceData: Partial<Resource> = {
      name: name || (selectedFile ? selectedFile.name : ''),
      description: description || undefined,
      tags: tags.length > 0 ? tags : undefined,
      estimatedCompletionTime,
      type: uploadType === 'link' ? 'link' : getFileType(selectedFile?.name || ''),
      ...(uploadType === 'file' ? { file: selectedFile } : { url: linkUrl })
    };

    onUpload(resourceData);
  };

  const getFileType = (filename: string): Resource['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'mp4': case 'avi': case 'mov': case 'wmv': return 'video';
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'webp': return 'image';
      case 'doc': case 'docx': case 'txt': case 'rtf': return 'document';
      case 'exe': case 'msi': case 'dmg': return 'executable';
      default: return 'document';
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setTags([]);
    setEstimatedTime('');
    setTimeUnit('minutes');
    setUploadType('file');
    setLinkUrl('');
    setSelectedFile(null);
    onClose();
  };

  const isFormValid = () => {
    if (uploadType === 'file') {
      return selectedFile !== null;
    }
    return linkUrl.trim() !== '';
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add Resource
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {/* Upload Type Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Resource Type
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="File Upload"
              icon={<AttachFile />}
              onClick={() => setUploadType('file')}
              variant={uploadType === 'file' ? 'filled' : 'outlined'}
              color={uploadType === 'file' ? 'primary' : 'default'}
              sx={{ cursor: 'pointer' }}
            />
            <Chip
              label="Web Link"
              icon={<LinkIcon />}
              onClick={() => setUploadType('link')}
              variant={uploadType === 'link' ? 'filled' : 'outlined'}
              color={uploadType === 'link' ? 'primary' : 'default'}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Box>

        {/* File Upload or Link Input */}
        {uploadType === 'file' ? (
          <Box sx={{ mb: 3 }}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              onClick={handleFileSelect}
              startIcon={<CloudUpload />}
              fullWidth
              sx={{
                py: 2,
                borderStyle: 'dashed',
                bgcolor: selectedFile ? `${theme.palette.primary.main}08` : 'transparent'
              }}
            >
              {selectedFile ? selectedFile.name : 'Choose file to upload'}
            </Button>
          </Box>
        ) : (
          <TextField
            label="Resource URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
            placeholder="https://example.com/resource"
          />
        )}

        {/* Resource Details */}
        <TextField
          label="Resource Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder={selectedFile ? selectedFile.name : 'Enter resource name'}
        />

        <TextField
          label="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
          placeholder="Brief description of the resource..."
        />

        {/* Tags */}
        <Autocomplete
          multiple
          options={PREDEFINED_TAGS}
          freeSolo
          value={tags}
          onChange={(_, newValue) => setTags(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                variant="filled"
                sx={{ 
                  bgcolor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags (Optional)"
              placeholder="Add tags..."
            />
          )}
          sx={{ mb: 2 }}
        />

        {/* Estimated Completion Time */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Estimated Completion Time (Optional)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value ? Number(e.target.value) : '')}
            placeholder="30"
            inputProps={{ min: 1, max: 999 }}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Unit</InputLabel>
            <Select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as 'minutes' | 'hours')}
              label="Unit"
            >
              <MenuItem value="minutes">Minutes</MenuItem>
              <MenuItem value="hours">Hours</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Uploading...</Typography>
              <Typography variant="body2">{uploadProgress}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid() || uploading}
          startIcon={<CloudUpload />}
        >
          {uploading ? 'Uploading...' : 'Upload Resource'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceUploadDialog;
