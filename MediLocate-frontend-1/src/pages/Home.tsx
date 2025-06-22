import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const Home: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mt: 4 }}>
            <LocalHospitalIcon sx={{ fontSize: 60 }} color="primary" />
            <Typography variant="h2" component="h1" gutterBottom color="primary.main" fontWeight="bold">
            MediLocate
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
            Your trusted partner in finding the right medicine, right when you need it.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '700px', mx: 'auto' }}>
            Seamlessly search for available medicines in your vicinity. For pharmacies, we offer a simple way to manage and showcase your inventory. Get started by logging in or creating an account.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                startIcon={<VpnKeyIcon />}
            >
                Login
            </Button>
            <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                startIcon={<SearchIcon />}
            >
                Register
            </Button>
            </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;