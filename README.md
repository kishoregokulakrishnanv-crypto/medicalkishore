# Kishore Medical Backend

A Node.js/Express backend server for the Kishore Medical website.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
  - Response: Server status and timestamp

### Services
- **GET** `/api/services`
  - Response: List of all medical services

### Doctors
- **GET** `/api/doctors`
  - Response: List of all doctors with details

### Appointments
- **POST** `/api/appointment`
  - Body: 
    ```json
    {
      "name": "Patient Name",
      "email": "patient@email.com",
      "phone": "1234567890",
      "service": "General Checkup",
      "date": "2026-08-20"
    }
    ```
  - Response: Appointment confirmation

## Environment Variables

Configure in `.env` file:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
kishore medical/
├── server.js          - Main server file
├── package.json       - Dependencies
├── .env               - Environment variables
├── home.html          - Frontend HTML
├── home.css           - Frontend styles
├── home.js            - Frontend script
└── medicine.html      - Medicine page
```

## Next Steps

- Add database connection (MongoDB, MySQL, etc.)
- Add authentication (JWT, sessions)
- Add data validation
- Add logging
- Deploy to cloud
