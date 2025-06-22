import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserDashboard from './UserDashboard';
import UploadInventory from './UploadInventory';
import { Container, CircularProgress, Box, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
       <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
                Please log in to view your dashboard.
            </Typography>
        </Box>
       </Container>
    );
  }

  return user.is_pharmacy ? <UploadInventory /> : <UserDashboard />;
};

export default Dashboard; 