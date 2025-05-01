# Health Authority Portal

A web application for managing and viewing health incidents data.

## Features

- Secure login system
- Dashboard with incidents data display
- Responsive design
- XML data integration

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Access the application at `http://localhost:3001`

## Test Credentials

- Username: admin, Password: admin123
- Username: doctor, Password: doctor123
- Username: nurse, Password: nurse123

## Deployment

### Deploying to Render.com

1. Create a free account on [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the following settings:
   - Name: health-authority-portal
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add the following environment variables:
   - `SESSION_SECRET`: (generate a random string)
6. Deploy!

### Deploying to Heroku

1. Create a free account on [Heroku](https://heroku.com)
2. Install the Heroku CLI
3. Run the following commands:
```bash
heroku login
heroku create health-authority-portal
git push heroku main
```

## Environment Variables

- `PORT`: The port number the server will run on (default: 3001)
- `SESSION_SECRET`: Secret key for session management 