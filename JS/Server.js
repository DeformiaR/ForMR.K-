const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');

// Serve static files
// Adjust the paths to correctly point to the 'css' and 'html' folders relative to 'Server.js'
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/html', express.static(path.join(__dirname, '../html')));

app.use(express.urlencoded({ extended: true }));

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'Deformia@1500701327280',
    database: 'testc',
};

// Serve the SignUpPage.html at the root
app.get('/', (req, res) => {
    // Ensure the file path correctly points to the SignUpPage.html
    res.sendFile(path.join(__dirname, '../html/SignUpPage.html'));
});

// Handle the sign-up form submission


const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}. Navigate to http://localhost:${port}`);
});
