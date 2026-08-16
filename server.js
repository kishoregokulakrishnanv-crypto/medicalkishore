const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// Basic Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.get('/api/services', (req, res) => {
  const services = [
    { id: 1, name: 'General Checkup', description: 'Complete health checkup' },
    { id: 2, name: 'Dental Care', description: 'Dental consultation and treatment' },
    { id: 3, name: 'Surgery', description: 'Surgical procedures' },
    { id: 4, name: 'Pediatrics', description: 'Child healthcare' }
  ];
  res.json(services);
});

app.post('/api/appointment', (req, res) => {
  const { name, email, phone, service, date } = req.body;
  
  if (!name || !email || !phone || !service || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Save appointment (you can add database here later)
  const appointment = {
    id: Date.now(),
    name,
    email,
    phone,
    service,
    date,
    status: 'Pending'
  };
  
  res.status(201).json({ message: 'Appointment booked successfully', appointment });
});

app.get('/api/doctors', (req, res) => {
  const doctors = [
    { id: 1, name: 'Dr. Kishore Kumar', specialization: 'General Physician', experience: '10 years' },
    { id: 2, name: 'Dr. Anjali Singh', specialization: 'Dentist', experience: '8 years' },
    { id: 3, name: 'Dr. Rajesh Verma', specialization: 'Surgeon', experience: '15 years' }
  ];
  res.json(doctors);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🏥 Kishore Medical Backend running on http://localhost:${PORT}`);
  console.log('📡 Available endpoints:');
  console.log('   GET  /api/health - Check server status');
  console.log('   GET  /api/services - Get all services');
  console.log('   GET  /api/doctors - Get all doctors');
  console.log('   POST /api/appointment - Book an appointment');
});

module.exports = app;
