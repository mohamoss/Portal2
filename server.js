const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Mock users for testing
const users = {
    'admin': 'admin123',
    'doctor': 'doctor123',
    'nurse': 'nurse123'
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'health-authority-secret',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (users[username] && users[username] === password) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/dashboard');
    } else {
        res.send('Invalid username or password!');
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/');
        return;
    }
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/incidents', (req, res) => {
    if (!req.session.loggedin) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const filePath = path.join(__dirname, 'incidents.xml');
    console.log('Attempting to read file from:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error('File does not exist at path:', filePath);
        res.status(500).json({ 
            error: 'Incidents file not found',
            details: `File not found at: ${filePath}`
        });
        return;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ 
                error: 'Error reading incidents file',
                details: err.message
            });
            return;
        }

        console.log('File read successfully, parsing XML...');
        xml2js.parseString(data, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                res.status(500).json({ 
                    error: 'Error parsing XML',
                    details: err.message
                });
                return;
            }

            if (!result || !result.Incidents || !result.Incidents.Incident) {
                console.error('Invalid XML structure:', result);
                res.status(500).json({ 
                    error: 'Invalid XML structure',
                    details: 'XML file does not contain expected structure'
                });
                return;
            }

            console.log('XML parsed successfully, sending response...');
            res.json(result.Incidents.Incident);
        });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 