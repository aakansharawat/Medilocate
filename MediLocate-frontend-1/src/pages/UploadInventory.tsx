import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { inventoryAPI } from '../services/api';

const UploadInventory: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError('');
      setSuccess('');
      setErrorDetails([]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setErrorDetails([]);

    try {
      const response = await inventoryAPI.uploadInventory(selectedFile);
      setSuccess(response.message || 'File uploaded successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please check the file format and try again.');
      if(err.response?.data?.details) {
        setErrorDetails(err.response.data.details);
      }
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Pharmacy Dashboard
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom color="text.secondary">
          Upload Your Medicine Inventory
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Upload CSV File
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Select CSV File
                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </Button>

              {selectedFile && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Selected file: <strong>{selectedFile.name}</strong>
                </Typography>
              )}

              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Upload Inventory'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                  {errorDetails.length > 0 && (
                      <List dense sx={{mt: 1}}>
                          {errorDetails.map((detail, index) => (
                              <ListItem key={index} sx={{pl:0}}>
                                  <ListItemText primaryTypographyProps={{fontSize: '0.875rem'}} primary={detail} />
                              </ListItem>
                          ))}
                      </List>
                  )}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                CSV Format Instructions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please ensure your CSV file has the following columns in order:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="id" secondary="A unique number for the inventory item" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="pharmacy_id" secondary="Your pharmacy's unique ID" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="medicine_id" secondary="The ID of the medicine" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="name" secondary="The name of the medicine" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="manufacturer" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="description" />
                </ListItem>
                 <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="stock" secondary="Number of units available" />
                </ListItem>
                 <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="price" secondary="Price per unit" />
                </ListItem>
                 <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="expiry_date" secondary="Format: YYYY-MM-DD" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UploadInventory; 