import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { LocationOn, Phone, Email } from '@mui/icons-material';

const Pharmacy: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // TODO: Fetch pharmacy details by ID
    // For now, showing placeholder data
    setLoading(false);
    setPharmacy({
      id: id,
      name: 'Sample Pharmacy',
      address: '123 Main Street, City, State 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@samplepharmacy.com',
      medicines: [
        {
          name: 'Paracetamol',
          stock: 50,
          price: 5.99,
          expiry_date: '2024-12-31',
        },
        {
          name: 'Ibuprofen',
          stock: 30,
          price: 7.99,
          expiry_date: '2024-11-30',
        },
      ],
    });
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!pharmacy) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Pharmacy not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          {pharmacy.name}
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {pharmacy.address}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {pharmacy.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {pharmacy.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Available Medicines
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pharmacy.medicines?.length || 0} medicines in stock
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {pharmacy.medicines && pharmacy.medicines.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Medicine Inventory
            </Typography>
            <Grid container spacing={3}>
              {pharmacy.medicines.map((medicine: any, index: number) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        {medicine.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Chip 
                          label={`Stock: ${medicine.stock}`} 
                          color={medicine.stock > 10 ? 'success' : 'warning'}
                          size="small"
                        />
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${medicine.price}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Expires: {new Date(medicine.expiry_date).toLocaleDateString()}
                      </Typography>
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

export default Pharmacy;