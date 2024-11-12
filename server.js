const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware
app.use(cors()); // Use cors middleware
app.use(express.json()); // For parsing application/json

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'testdata'
});


// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

//Insert data in table
app.post('/add-test-data', (req, res)=>{

    const { flowName, testCaseName, testKey, testValue } = req.body;
    const query = 'INSERT INTO TestScriptData (flowName, testCaseName, testKey, testValue) VALUES (?, ?, ?, ?)';

   db.query(query, [flowName, testCaseName, testKey, testValue], (err, results) => {
       if (err) {
           console.error('Error inserting data:', err);
           return res.status(500).send('Error adding data.');
       }
       res.status(200).send('Data added successfully!');
   });
});

//Get all flow names
app.get('/flow-names', (req, res)=>{
    const query = 'SELECT DISTINCT flowName from TestScriptData';
    db.query(query, (err, results)=>{
        if (err) {
            console.error('Error fetching flow names:', err);
            return res.status(500).send('Error fetching flow names.');
        }
        res.status(200).json(results);
    })
})

// Endpoint to get test data by flowName
app.get('/test-data/:flowName', (req, res) => {
    const flowName = req.params.flowName;
    const query = 'SELECT testCaseName, testKey, testValue FROM TestScriptData WHERE flowName = ?';

    db.query(query, [flowName], (err, results) => {
        if (err) {
            console.error('Error fetching test data:', err);
            return res.status(500).send('Error fetching test data.');
        }
        res.status(200).json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});