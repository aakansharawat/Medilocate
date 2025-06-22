import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
} from '@mui/material';
import { Person, Email, LocationOn, Lock } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4">{user.name}</Typography>
              <Typography variant="body1" color="text.secondary">
                {user.is_pharmacy ? 'Pharmacy Owner' : 'User'}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <List sx={{ mt: 2 }}>
            <ListItem>
              <ListItemIcon>
                <Person color="primary"/>
              </ListItemIcon>
              <ListItemText primary="Full Name" secondary={user.name} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Email color="primary"/>
              </ListItemIcon>
              <ListItemText primary="Email Address" secondary={user.email} />
            </ListItem>
            {user.address && (
              <ListItem>
                <ListItemIcon>
                  <LocationOn color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Registered Address" secondary={user.address} />
              </ListItem>
            )}
          </List>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
             <Button 
                variant="outlined" 
                startIcon={<Lock />}
                onClick={logout}
             >
                Logout
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 