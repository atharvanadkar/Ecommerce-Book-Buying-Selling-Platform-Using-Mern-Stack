import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Alert,
  Chip,
  Stack,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  LocalLibrary,
  Favorite,
  VolunteerActivism,
  EmojiEvents,
  CheckCircle
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../features/auth/AuthSlice';

const DonationPage = () => {
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectLoggedInUser);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    bookTitle: '',
    author: '',
    isbn: '',
    condition: 'good',
    category: '',
    description: '',
    quantity: 1,
    donorName: loggedInUser?.name || '',
    donorEmail: loggedInUser?.email || '',
    donorPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    pickupPreference: 'pickup',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'History',
    'Biography',
    'Children',
    'Self-Help',
    'Fantasy',
    'Mystery',
    'Romance',
    'Technology',
    'Academic',
    'Textbook',
    'Other'
  ];

  const conditions = [
    { value: 'new', label: 'New', icon: '⭐' },
    { value: 'good', label: 'Good', icon: '📖' },
    { value: 'fair', label: 'Fair', icon: '📕' },
    { value: 'poor', label: 'Poor', icon: '📗' }
  ];

  const steps = ['Book Details', 'Donor Information', 'Review & Submit'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && validateStep1()) {
      setActiveStep((prev) => prev + 1);
    } else if (activeStep === 1 && validateStep2()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.bookTitle) newErrors.bookTitle = 'Book title is required';
    if (!formData.author) newErrors.author = 'Author name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.donorName) newErrors.donorName = 'Name is required';
    if (!formData.donorEmail) newErrors.donorEmail = 'Email is required';
    if (!formData.donorPhone) newErrors.donorPhone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call to submit donation
      // const response = await axios.post('/api/donations', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/donation-success');
      }, 3000);
      
    } catch (error) {
      console.error('Donation submission error:', error);
      setLoading(false);
      setErrors({ submit: 'Failed to submit donation. Please try again.' });
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderBookDetails();
      case 1:
        return renderDonorInfo();
      case 2:
        return renderReview();
      default:
        return null;
    }
  };

  const renderBookDetails = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Book Title"
            name="bookTitle"
            value={formData.bookTitle}
            onChange={handleChange}
            error={!!errors.bookTitle}
            helperText={errors.bookTitle}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            error={!!errors.author}
            helperText={errors.author}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ISBN (Optional)"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="978-0-123-45678-9"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            error={!!errors.quantity}
            helperText={errors.quantity}
            required
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <FormLabel>Category</FormLabel>
            <RadioGroup
              row
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <Grid container spacing={1}>
                {categories.slice(0, 6).map((cat) => (
                  <Grid item xs={6} key={cat}>
                    <FormControlLabel
                      value={cat}
                      control={<Radio size="small" />}
                      label={cat}
                    />
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
            {errors.category && (
              <Typography color="error" variant="caption">{errors.category}</Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <FormLabel>Condition</FormLabel>
            <RadioGroup
              row
              name="condition"
              value={formData.condition}
              onChange={handleChange}
            >
              {conditions.map((cond) => (
                <FormControlLabel
                  key={cond.value}
                  value={cond.value}
                  control={<Radio size="small" />}
                  label={`${cond.icon} ${cond.label}`}
                />
              ))}
            </RadioGroup>
            {errors.condition && (
              <Typography color="error" variant="caption">{errors.condition}</Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Book Description / Condition Details"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Any additional details about the book(s)"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderDonorInfo = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="donorName"
            value={formData.donorName}
            onChange={handleChange}
            error={!!errors.donorName}
            helperText={errors.donorName}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="donorEmail"
            type="email"
            value={formData.donorEmail}
            onChange={handleChange}
            error={!!errors.donorEmail}
            helperText={errors.donorEmail}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            name="donorPhone"
            value={formData.donorPhone}
            onChange={handleChange}
            error={!!errors.donorPhone}
            helperText={errors.donorPhone}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            error={!!errors.state}
            helperText={errors.state}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            error={!!errors.pincode}
            helperText={errors.pincode}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel>Pickup Preference</FormLabel>
            <RadioGroup
              row
              name="pickupPreference"
              value={formData.pickupPreference}
              onChange={handleChange}
            >
              <FormControlLabel
                value="pickup"
                control={<Radio />}
                label="Request Pickup"
              />
              <FormControlLabel
                value="dropoff"
                control={<Radio />}
                label="I'll Drop Off"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Additional Notes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Any special instructions or additional information"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderReview = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          📋 Donation Summary
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Book Title
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formData.bookTitle}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">
              Author
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formData.author}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">
              Category
            </Typography>
            <Chip 
              label={formData.category} 
              size="small" 
              color="primary" 
              sx={{ mb: 2 }}
            />
            
            <Typography variant="subtitle2" color="text.secondary">
              Condition
            </Typography>
            <Chip 
              label={formData.condition.toUpperCase()} 
              size="small" 
              color={
                formData.condition === 'new' ? 'success' :
                formData.condition === 'good' ? 'primary' :
                formData.condition === 'fair' ? 'warning' : 'error'
              }
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Quantity
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formData.quantity} book{formData.quantity > 1 ? 's' : ''}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">
              Donor
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formData.donorName}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">
              Pickup Preference
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formData.pickupPreference === 'pickup' ? '🚚 Request Pickup' : '🏢 Drop Off'}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {formData.description || 'No additional details provided'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          By submitting this donation, you agree to our donation terms and conditions.
          We'll contact you within 24-48 hours to confirm your donation.
        </Typography>
      </Alert>
    </Box>
  );

  if (success) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            🎉 Donation Submitted!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Thank you for your generous donation! We'll review your submission and contact you shortly.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will receive a confirmation email at {formData.donorEmail}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VolunteerActivism sx={{ color: '#1976d2' }} />
            Donate Books
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Give the gift of reading! Donate your books to help others discover the joy of reading.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Chip icon={<LocalLibrary />} label="Free Pickup" variant="outlined" />
            <Chip icon={<EmojiEvents />} label="Tax Benefits" variant="outlined" />
            <Chip icon={<Favorite />} label="Spread Knowledge" variant="outlined" />
          </Stack>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          {errors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Donation'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DonationPage;