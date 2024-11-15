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
     // Query to check if the entry already exists
        const checkQuery = 'SELECT * FROM TestScriptData WHERE flowName = ? AND testCaseName = ? AND testKey = ?';
        const checkParams = [flowName, testCaseName, testKey];

    db.query(checkQuery, checkParams, (err, results) => {
            if (err) {
                console.error('Error checking for existing data:', err);
                return res.status(500).json({ error: 'Error checking for existing data.' });
            }

            if (results.length > 0) {
                // Entry already exists
                return res.status(409).json({ message: 'Duplicate entry: this data already exists.' });
            }

            // Proceed to insert data if no duplicate is found
            const insertQuery = 'INSERT INTO TestScriptData (flowName, testCaseName, testKey, testValue) VALUES (?, ?, ?, ?)';
            const insertParams = [flowName, testCaseName, testKey, testValue];

            db.query(insertQuery, insertParams, (insertErr) => {
                if (insertErr) {
                    console.error('Error adding data:', insertErr);
                    return res.status(500).json({ error: 'Error adding data.' });
                }
                res.status(200).json({ message: 'Data added successfully!' });
            });
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

// Endpoint to get test data by flowName and optionally by testCaseName
app.get('/test-data/:flowName', (req, res) => {
    const flowName = req.params.flowName;
    const testCaseName = req.query.scriptName;
    console.log(req.query)

    // Base query
    let query = 'SELECT id, testCaseName, testKey, testValue FROM TestScriptData WHERE flowName = ?';
    const queryParams = [flowName];

    // Add testCaseName condition if it exists in the query parameters
    if (testCaseName) {
        query += ' AND testCaseName = ?';
        queryParams.push(testCaseName);
    }

    db.query(query, queryParams, (err, results) => {
   // console.log(query)
    console.log("queryParams", queryParams)
        if (err) {
            console.error('Error fetching test data:', err);
            return res.status(500).send('Error fetching test data.');
        }
        res.status(200).json(results);
    });
});

app.delete('/delete-test-data', (req, res) => {
    const { flowName, testCaseName, testKey } = req.body;
    if (!flowName || !testCaseName || !testKey ) {
            return res.status(400).send('flowName and testCaseName and testKey are required');
        }

    const query = 'DELETE FROM TestScriptData WHERE flowName = ? AND testCaseName = ? AND testKey = ?';
    const queryParams = [flowName, testCaseName, testKey];

    db.query(query, queryParams, (err, result) => {
            if (err) {
                console.error('Error deleting test data:', err);
                return res.status(500).send('Error deleting test data.');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('No data found to delete with the given criteria.');
            }

            res.status(200).send('Test data deleted successfully');
        });



})

app.post('/edit-test-data', (req, res)=>{

     const { id, testKey, testValue } = req.body;
        const query = 'UPDATE TestScriptData SET testKey = ?, testValue = ? WHERE id = ?';
        const queryParams = [testKey, testValue, id];
    console.log(queryParams)
   db.query(query, queryParams, (err, results) => {
   console.log(query)
   console.log(queryParams)
       if (err) {
           console.error('Error inserting data:', err);
           return res.status(500).send('Error adding data.');
       }
       res.status(200).json({ message: 'Data updated successfully!' });
   });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});