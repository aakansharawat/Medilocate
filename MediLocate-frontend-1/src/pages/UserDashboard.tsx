import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Autocomplete,
  Switch,
  FormControlLabel,
  Divider,
  Chip
} from '@mui/material';
import { Search as SearchIcon, MyLocation as MyLocationIcon } from '@mui/icons-material';
import { searchAPI } from '../services/api';
import { SearchResult } from '../types';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [address, setAddress] = useState<string>('');
  const [useCustomAddress, setUseCustomAddress] = useState<boolean>(false);
  const [medicineName, setMedicineName] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user?.address && !useCustomAddress) {
      setAddress(user.address);
    }
  }, [user, useCustomAddress]);

  const handleMedicineChange = async (value: string) => {
    setMedicineName(value);
    if (value.length >= 2) {
      try {
        const suggestions = await searchAPI.searchByPrefix(value);
        setSuggestions(suggestions);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSearch = async () => {
    const searchAddress = useCustomAddress ? address : user?.address;
    if (!searchAddress || !medicineName) {
      setError('Please provide an address and medicine name');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const searchResults = await searchAPI.searchMedicine({
        address: searchAddress,
        medicine_name: medicineName,
      });
      setResults(searchResults);
    } catch (err: any) {
      let errorMessage = err.response?.data?.error || 'Search failed';
      if (errorMessage.includes('Invalid address')) {
        errorMessage = 'Could not find that location. Please try a more general area or check for typos.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          User Dashboard
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom color="text.secondary">
          Find the nearest pharmacy with your medicine
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={useCustomAddress}
                            onChange={(e) => setUseCustomAddress(e.target.checked)}
                            name="customAddressSwitch"
                        />
                    }
                    label="Use a different address for this search"
                />
            </Grid>
            <Grid item xs={12} md={useCustomAddress ? 5 : 12}>
              <TextField
                fullWidth
                label={useCustomAddress ? "Your Address" : "Your Registered Address"}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                disabled={!useCustomAddress}
                InputProps={{
                    startAdornment: (
                        <MyLocationIcon color={useCustomAddress ? "inherit" : "disabled"} sx={{mr:1}}/>
                    ),
                }}
              />
            </Grid>
             <Grid item xs={12} md={5}>
              <Autocomplete
                freeSolo
                options={suggestions}
                value={medicineName}
                onChange={(_, newValue) => setMedicineName(newValue || '')}
                onInputChange={(_, newInputValue) => handleMedicineChange(newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Medicine Name"
                    placeholder="Start typing medicine name..."
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={loading || !address || !medicineName}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                sx={{ height: '56px' }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        
        {results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Found {results.length} pharmacy{results.length !== 1 ? 'ies' : ''} with {medicineName}
            </Typography>
            <Grid container spacing={3}>
              {results.map((pharmacyResult, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                          {pharmacyResult.details.pharmacy_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📍 {pharmacyResult.details.pharmacy_address}
                        </Typography>
                      </Box>
                      <Divider>
                        <Chip label="Available Medicines" size="small" />
                      </Divider>
                      <Box sx={{ mt: 2 }}>
                        {pharmacyResult.medicines.map((medicine, medIndex) => (
                          <Box key={medIndex} sx={{ mb: medIndex < pharmacyResult.medicines.length - 1 ? 2 : 0 }}>
                            <Typography variant="body1" fontWeight="bold">
                              💊 {medicine.medicine_name}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 3 }}>
                              <Typography variant="body2">
                                Stock: {medicine.stock} units
                              </Typography>
                              <Typography variant="body2" color="primary" fontWeight="bold">
                                ₹{medicine.price}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 3 }}>
                               <Typography variant="body2" color="text.secondary">
                                Expires: {new Date(medicine.expiry_date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          {pharmacyResult.details.distance_km} km away
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UserDashboard; 