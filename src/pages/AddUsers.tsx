
import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';

const AddUsers = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setResponse(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }
    setUploading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axiosInstance.post('/auth/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
      const data = res.data;
      if (data.error) {
        setError(data.error?.message || 'Bulk Addition failed');
      } else {
        setResponse(data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Add Users in Bulk
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload a CSV or Excel file to add users in bulk.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
          >
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {response && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {typeof response === 'string' ? response : 'Bulk users added successfully!'}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddUsers