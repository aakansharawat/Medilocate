import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const AboutUs: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          About MediLocate
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to MediLocate, your reliable partner in finding essential medicines when you need them the most. Our mission is to bridge the gap between pharmacies and individuals, ensuring timely access to medication.
        </Typography>
        <Typography variant="body1" paragraph>
          In a world where health is paramount, locating a specific medicine quickly can be a challenge. MediLocate simplifies this process with a powerful, easy-to-use platform. Whether you are a user searching for a nearby pharmacy with available stock or a pharmacy owner looking to reach more customers, our app is designed for you.
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom sx={{mt: 3}}>
          Our Vision
        </Typography>
        <Typography variant="body1" paragraph>
          We envision a future where no one has to struggle to find necessary medication. By leveraging technology, we aim to create a comprehensive and up-to-date network of pharmacies, making healthcare more accessible and efficient for everyone.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutUs; 