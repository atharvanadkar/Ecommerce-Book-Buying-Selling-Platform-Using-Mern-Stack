import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  LocalLibrary,
  Favorite,
  VolunteerActivism
} from '@mui/icons-material';

const DonationSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 100, color: '#4caf50', mb: 2 }} />
        
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          📚 Thank You!
        </Typography>
        
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Your Book Donation has been Received
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Your generous contribution will help spread knowledge and literacy.
          We'll process your donation and contact you within 24-48 hours.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            icon={<LocalLibrary />} 
            label="Free Pickup" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            icon={<VolunteerActivism />} 
            label="Tax Benefits Available" 
            color="success" 
            variant="outlined" 
          />
          <Chip 
            icon={<Favorite />} 
            label="You're Awesome!" 
            color="error" 
            variant="outlined" 
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          You'll receive a confirmation email shortly with further details.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
          >
            🏠 Go to Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/browse-books')}
          >
            📖 Browse Books
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default DonationSuccessPage;