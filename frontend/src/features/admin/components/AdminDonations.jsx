/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Stack,
  Divider,
  Badge
} from '@mui/material';
import {
  Refresh,
  Visibility,
  CheckCircle,
  Cancel,
  LocalShipping,
  DoneAll,
  Search,
  Download,
  Email,
  Phone,
  LocationOn,
  Person,
  VolunteerActivism
} from '@mui/icons-material';
import { axiosi } from '../../../config/axios';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    pickedUp: 0,
    delivered: 0,
    cancelled: 0
  });

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await axiosi.get('/admin/donations');
      setDonations(response.data.donations);
      setFilteredDonations(response.data.donations);
      calculateStats(response.data.donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      showSnackbar('Failed to fetch donations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []); // Removed fetchDonations dependency

  const calculateStats = (donationsData) => {
    const pending = donationsData.filter(d => d.status === 'pending').length;
    const confirmed = donationsData.filter(d => d.status === 'confirmed').length;
    const pickedUp = donationsData.filter(d => d.status === 'picked_up').length;
    const delivered = donationsData.filter(d => d.status === 'delivered').length;
    const cancelled = donationsData.filter(d => d.status === 'cancelled').length;

    setStats({
      total: donationsData.length,
      pending,
      confirmed,
      pickedUp,
      delivered,
      cancelled
    });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    applyFilters(searchTerm, newValue);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, selectedTab);
  };

  const applyFilters = (term, tab) => {
    let filtered = [...donations];

    if (tab === 1) filtered = filtered.filter(d => d.status === 'pending');
    else if (tab === 2) filtered = filtered.filter(d => d.status === 'confirmed');
    else if (tab === 3) filtered = filtered.filter(d => d.status === 'picked_up');
    else if (tab === 4) filtered = filtered.filter(d => d.status === 'delivered');
    else if (tab === 5) filtered = filtered.filter(d => d.status === 'cancelled');

    if (term) {
      filtered = filtered.filter(d =>
        d.bookTitle?.toLowerCase().includes(term) ||
        d.author?.toLowerCase().includes(term) ||
        d.donorName?.toLowerCase().includes(term) ||
        d.donorEmail?.toLowerCase().includes(term)
      );
    }

    setFilteredDonations(filtered);
  };

  const handleStatusChange = async (donationId, newStatus) => {
    try {
      await axiosi.put(`/admin/donations/${donationId}/status`, {
        status: newStatus
      });
      
      showSnackbar(`Donation status updated to ${newStatus}`, 'success');
      fetchDonations();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating donation:', error);
      showSnackbar('Failed to update donation status', 'error');
    }
  };

  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setOpenDialog(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const getStatusChip = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'warning' },
      confirmed: { label: 'Confirmed', color: 'info' },
      picked_up: { label: 'Picked Up', color: 'primary' },
      delivered: { label: 'Delivered', color: 'success' },
      cancelled: { label: 'Cancelled', color: 'error' }
    };
    const info = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={info.label} color={info.color} size="small" />;
  };

  const getStatusActions = (status) => {
    const actions = [];
    if (status === 'pending') {
      actions.push({ label: 'Confirm', value: 'confirmed', icon: <CheckCircle /> });
      actions.push({ label: 'Cancel', value: 'cancelled', icon: <Cancel /> });
    } else if (status === 'confirmed') {
      actions.push({ label: 'Mark as Picked Up', value: 'picked_up', icon: <LocalShipping /> });
    } else if (status === 'picked_up') {
      actions.push({ label: 'Mark as Delivered', value: 'delivered', icon: <DoneAll /> });
    }
    return actions;
  };

  const StatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total</Typography>
            <Typography variant="h4">{stats.total}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ borderLeft: '4px solid #ff9800' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Pending</Typography>
            <Typography variant="h4">{stats.pending}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ borderLeft: '4px solid #2196f3' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Confirmed</Typography>
            <Typography variant="h4">{stats.confirmed}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ borderLeft: '4px solid #9c27b0' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Picked Up</Typography>
            <Typography variant="h4">{stats.pickedUp}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ borderLeft: '4px solid #4caf50' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Delivered</Typography>
            <Typography variant="h4">{stats.delivered}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ borderLeft: '4px solid #f44336' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Cancelled</Typography>
            <Typography variant="h4">{stats.cancelled}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VolunteerActivism sx={{ color: '#1976d2' }} />
            Donation Management
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchDonations}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Export
            </Button>
          </Box>
        </Box>

        <StatsCards />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="All" />
            <Tab label={
              <Badge badgeContent={stats.pending} color="warning">
                Pending
              </Badge>
            } />
            <Tab label="Confirmed" />
            <Tab label="Picked Up" />
            <Tab label="Delivered" />
            <Tab label="Cancelled" />
          </Tabs>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search by book, author, donor..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book Details</TableCell>
                <TableCell>Donor</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>Loading donations...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredDonations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="textSecondary">No donations found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDonations.map((donation) => (
                  <TableRow key={donation._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{donation.bookTitle}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          by {donation.author}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{donation.donorName}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {donation.donorEmail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{donation.quantity}</TableCell>
                    <TableCell>{getStatusChip(donation.status)}</TableCell>
                    <TableCell>
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDonation(donation)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Donation Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDonation && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  📖 Donation Details
                </Typography>
                {getStatusChip(selectedDonation.status)}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Book Title</Typography>
                  <Typography variant="body1">{selectedDonation.bookTitle}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Author</Typography>
                  <Typography variant="body1">{selectedDonation.author}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                  <Chip label={selectedDonation.category || 'N/A'} size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Condition</Typography>
                  <Chip 
                    label={selectedDonation.condition || 'N/A'} 
                    size="small"
                    color={
                      selectedDonation.condition === 'new' ? 'success' :
                      selectedDonation.condition === 'good' ? 'primary' :
                      selectedDonation.condition === 'fair' ? 'warning' : 'error'
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>
                    Donor Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <Person fontSize="small" /> Name
                  </Typography>
                  <Typography variant="body1">{selectedDonation.donorName}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <Email fontSize="small" /> Email
                  </Typography>
                  <Typography variant="body1">{selectedDonation.donorEmail}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <Phone fontSize="small" /> Phone
                  </Typography>
                  <Typography variant="body1">{selectedDonation.donorPhone}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <LocationOn fontSize="small" /> Address
                  </Typography>
                  <Typography variant="body2">
                    {selectedDonation.address}
                    {selectedDonation.city && `, ${selectedDonation.city}`}
                    {selectedDonation.state && `, ${selectedDonation.state}`}
                    {selectedDonation.pincode && ` - ${selectedDonation.pincode}`}
                  </Typography>
                </Grid>
                {selectedDonation.description && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Description
                    </Typography>
                    <Typography variant="body2">{selectedDonation.description}</Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Update Status
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    {getStatusActions(selectedDonation.status).map((action) => (
                      <Button
                        key={action.value}
                        variant="contained"
                        size="small"
                        startIcon={action.icon}
                        onClick={() => handleStatusChange(selectedDonation._id, action.value)}
                      >
                        {action.label}
                      </Button>
                    ))}
                    {selectedDonation.status === 'pending' && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleStatusChange(selectedDonation._id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDonations;