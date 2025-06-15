const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const activeLocations = {};

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL, // Should match frontend domain
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true,
}));


// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to mongo DB"))
  .catch(err => console.log("Fail to connect", err));

// ✅ Location Schema & Model — ADD THIS HERE
const locationSchema = new mongoose.Schema({
  driverId: String,
  location: {
    lat: Number,
    lng: Number,
  },
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model('Location', locationSchema);

// ✅ Driver Schema (already in your code)
const driverSchema = new mongoose.Schema({
  driverId: String,
  name: String,
  number: String,
  email: String,
});

const Driver = mongoose.model('Driver', driverSchema);

// ✅ Route to add driver
app.post('/api/drivers', async (req, res) => {
  const { name, number, email } = req.body;
  const driverId = `DRIV${Math.floor(1000 + Math.random() * 9000)}`; // DRIV + 4 random digits

  const driver = new Driver({ driverId, name, number, email });
  await driver.save();
  res.json({ message: 'Driver added successfully' });
});

// ✅ Route to get all drivers
app.get('/api/drivers', async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

// ✅ Route to save location (API causing the 404 error)
app.post('/api/location', async (req, res) => {
  const { driverId, lat, lng } = req.body;

  activeLocations[driverId] = {
    location: { lat, lng },
    timestamp: new Date()
  };

  res.json({ message: 'Location stored in memory' });
});

// ✅ Route to get all active driver locations
app.get('/api/active-locations', async (req, res) => {
  try {
    const locations = await Promise.all(
      Object.entries(activeLocations).map(async ([driverId, data]) => {
        const driver = await Driver.findOne({ driverId });

        return {
          driverId,
          location: data.location,
          timestamp: data.timestamp,
          name: driver?.name || 'Unknown Driver',
          email: driver?.email || 'Not Provided'
        };
      })
    );

    res.json(locations);
  } catch (error) {
    console.error("Failed to fetch driver data:", error);
    res.status(500).json({ error: "Failed to retrieve active locations" });
  }
});


// ✅ Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// Logout API - removes driver's location
app.delete('/api/location/:driverId', (req, res) => {
  const { driverId } = req.params;
  delete activeLocations[driverId];
  res.json({ message: 'Driver location removed from memory' });
});


app.get("/", (req, res) => {
  res.send("✅ MERN Billing Backend is running!");
});