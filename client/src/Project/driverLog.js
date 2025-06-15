import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Table, TableHead,
  TableRow, TableCell, TableBody, Typography
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { purple } from '@mui/material/colors';

const DriverLog = () => {
  const [open, setOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({ name: '', number: '', email: '' });

  const fetchDrivers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/drivers`);
    setDrivers(res.data);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSubmit = async () => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/drivers`, formData);
    setOpen(false);
    setFormData({ name: '', number: '', email: '' });
    fetchDrivers();
  };

  // Login dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/location`, {
          driverId: 'DRIV0001', // You should dynamically assign this based on the logged-in driver
          lat: latitude,
          lng: longitude,
        });
        alert('Location shared successfully');
        handleCloseDialog();
      });
    } else {
      alert('Geolocation not supported');
    }
  };

  //For LOGOUT button
const handleLogout = async (driverId) => {
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/location/${driverId}`);
    alert('Location tracking stopped.');

    // Optional: Trigger map refresh here if you're lifting state or using shared context
    // OR: Do nothing, rely on 5-second auto-refresh in DriverMap.js
  } catch (err) {
    console.error(err);
    alert('Error stopping tracking.');
  }
};



  return (
    <div>
      <header className="bg-purple-800 py-4 shadow-md">
        <h1 className="text-center text-white text-3xl font-bold">Location Tracker</h1>
      </header>

      <div className="p-4">
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          fullWidth
          style={{ backgroundColor: '#6B21A8', color: 'white' }}
          onClick={() => setOpen(true)}
        >
          Add Driver
        </Button>

        {/* Add Driver Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add Driver</DialogTitle>
          <DialogContent className="space-y-4">
            <TextField label="Driver Name" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField label="Driver Number" fullWidth value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} />
            <TextField label="Email ID" fullWidth value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: '#6B21A8', color: 'white' }}>Submit</Button>
          </DialogActions>
        </Dialog>

        {/* Drivers Table */}
        <Table className="mt-8 shadow-lg rounded-xl overflow-hidden">
          <TableHead>
            <TableRow style={{ backgroundColor: purple[800] }}>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Number</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? 'bg-purple-50' : 'bg-purple-100'}
              >
                <TableCell className="font-medium text-purple-900">
                  {driver.driverId}
                </TableCell>
                <TableCell className="text-purple-900">{driver.name}</TableCell>
                <TableCell className="text-purple-900">{driver.number}</TableCell>
                <TableCell className="text-purple-900">{driver.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: purple[700], color: '#fff', marginRight: '8px' }}
                    onClick={handleOpenDialog}
                  >
                    Login
                  </Button>

                  {/* Location Tracking Dialog */}
                  <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle style={{ backgroundColor: purple[700], color: '#fff' }}>
                      Start Location Tracking
                    </DialogTitle>
                    <DialogContent>
                      <Typography className="mb-4">
                        Click "Start Tracking" to track your live location.
                        Please ensure your device’s location services are enabled.
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleTracking}
                        variant="contained"
                        style={{ backgroundColor: purple[600], color: '#fff' }}
                      >
                        Start Tracking
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Button
                  variant="outlined"
                  size="small"
                  style={{ borderColor: purple[300], color: purple[700] }}
                  onClick={() => handleLogout(driver.driverId)}
                  >
                    Logout
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DriverLog;
