import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Grid,
  FormHelperText
} from '@mui/material';
import { authAPI } from '../services/api';
import { RegisterData } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    is_pharmacy: false,
    address_line: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.register(formData);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      let errorMessage = err.response?.data?.error || 'Registration failed';
      if (errorMessage.includes('could not geocode')) {
          errorMessage = 'We could not find that address. Please try to be more specific or check for typos.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register for MediLocate
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name or Pharmacy Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                 <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                    Address for Location
                 </Typography>
                 <FormHelperText sx={{mb: 2}}>
                    Please provide a complete and accurate address. This will be used to find pharmacies near you.
                 </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="address_line"
                  label="Address Line (e.g., Street Name, Area)"
                  id="address_line"
                  autoComplete="street-address"
                  value={formData.address_line}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="city"
                  label="City"
                  id="city"
                  autoComplete="address-level2"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="state"
                  label="State / Province"
                  id="state"
                  autoComplete="address-level1"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="postal_code"
                  label="Postal Code"
                  id="postal_code"
                  autoComplete="postal-code"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="country"
                  label="Country"
                  id="country"
                  autoComplete="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="is_pharmacy"
                      checked={formData.is_pharmacy}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Register as a Pharmacy"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Sign In
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 