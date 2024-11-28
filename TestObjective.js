const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the current directory

// Google Sheets API setup
const sheets = google.sheets({ version: 'v4' });
const spreadsheetId = '1g7b7JhDanXGJ-jpoth0VfvB2RXahrB4Jmtz0KEdkHlY';  // Ensure this is correct
  // Path to your service account key

// Authentication with Google Sheets API
async function authenticate() {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);  // Assuming the secret is named GOOGLE_CREDENTIALS_JSON
        const auth = new google.auth.GoogleAuth({
            credentials : credentials;
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        return auth.getClient();
    } catch (error) {
        console.error("Authentication error: ", error);
        throw error;
    }
}

// Serve the HTML file for login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'TestObjective10.html'));  // Serve the HTML file correctly
});

// Handle login request and check if email exists in Google Sheets
app.post('/check-login', async (req, res) => {
    const email = req.body.email;

    console.log("Received login request for email:", email);

    try {
        const authClient = await authenticate();

        // Fetch data from Google Sheets (Columns B for email, Column N for scores)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Form_Responses_1!B:N',  // Adjust range to match where emails and scores are stored
            auth: authClient,
        });

        const rows = response.data.values;
        const found = rows.find(row => row[0] === email);  // Column B contains emails (index 0)

        if (found) {
            const score = found[12];  // Column N contains scores (index 13)
            if (score) {
                // If the candidate already has a score, prevent further test attempt
                console.log("Test already taken. Returning existing score:", score);
                return res.json({ status: 'error', message: 'Test already taken. You cannot retake the test.' });
            }

            // If email is found but no score, allow the test to proceed
            const name = found[1];  // Column C contains names (index 1)
            console.log("Email found, returning candidate name:", name);
            res.json({ status: 'success', name: name });
        } else {
            // Email not found
            console.log("Email not found in sheet");
            res.json({ status: 'error', message: 'Email not found' });
        }
    } catch (error) {
        console.error("Error during login request:", error);
        res.json({ status: 'error', message: 'An error occurred while logging in. Please try again.' });
    }
});

// Submit score to Google Sheets
app.post('/submit-score', async (req, res) => {
    const { email, score } = req.body;

    console.log("Received score submission for email:", email, "Score:", score);  // Log the score on the backend

    try {
        const authClient = await authenticate();

        // Fetch data from Google Sheets (Columns B for email, Column N for scores)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Form_Responses_1!B:N',  // Adjust range (Columns B for emails, Column N for scores)
            auth: authClient,
        });

        // console.log("Scores data fetched from Google Sheets:", response.data.values);  // Log fetched data

        const rows = response.data.values;
        const found = rows.find(row => row[0] === email);  // Find the row with the matching email

        if (found) {
            const rowIndex = rows.indexOf(found) + 1;  // Adjust row index for 1-based Sheets indexing
            console.log(`Updating score for email ${email} in row ${rowIndex}`);

            // Ensure the score is treated as a number
            const updatedScore = parseInt(score, 10);  // Parse the score to ensure it's a valid number

            if (isNaN(updatedScore)) {
                return res.json({ status: 'error', message: 'Invalid score value.' });
            }

            console.log("Parsed score before updating:", updatedScore);  // Log the parsed score

            // Update the score in the correct column (Column N)
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `Form_Responses_1!N${rowIndex}`,
                valueInputOption: 'RAW',  // Use RAW input to avoid any formatting changes
                resource: {
                    values: [[updatedScore]],  // Use the parsed score
                },
                auth: authClient,
            });

            console.log("Score updated successfully");
            res.json({ status: 'success', message: 'Score updated!' });
        } else {
            console.log("Email not found in scores sheet");
            res.json({ status: 'error', message: 'Email not found in scores' });
        }
    } catch (error) {
        console.error("Error while submitting score:", error);
        res.json({ status: 'error', message: 'Error submitting score. Please try again.' });
    }
});

// Route to get current test data (questions, options, duration)
app.get('/get-test-data', async (req, res) => {
    try {
        const authClient = await authenticate();
        
        // You can fetch the current test data (duration, questions, options) from a Google Sheet or local storage
        const currentTestData = {
            duration: 10,  // Example: Test duration in minutes
            questions: [
                { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"] },
                { question: "Who wrote 'Romeo and Juliet'?", options: ["Shakespeare", "Dickens", "Hemingway", "Austen"] },
                // More questions
            ]
        };

        res.json(currentTestData);
    } catch (error) {
        console.error("Error fetching test data:", error);
        res.json({ status: 'error', message: 'Error fetching test data.' });
    }
});

// Route to update test data
app.post('/update-test-data', async (req, res) => {
    const { duration, questions } = req.body;

    try {
        // Here, you would save the updated data to Google Sheets or your data store
        console.log("Updating test data: Duration:", duration, "Questions:", questions);
        
        // Example: Update Google Sheets with new data (questions, options, and duration)
        // Here you would write code to save the updated data in your Google Sheets.

        res.json({ status: 'success', message: 'Test data updated successfully!' });
    } catch (error) {
        console.error("Error updating test data:", error);
        res.json({ status: 'error', message: 'Error updating test data.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


