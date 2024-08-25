const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

const USER_ID = "john_doe_17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1, roll_number: ROLL_NUMBER });
});


app.post('/bfhl', (req, res) => {
    try {
        // Check if data is provided
        if (!req.body.data || !Array.isArray(req.body.data) || req.body.data.length === 0) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input. 'data' field is required and should be a non-empty array."
            });
        }

        const data = req.body.data;

        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));
        const lowercaseAlphabets = alphabets.filter(item => item === item.toLowerCase());

        const highestLowercaseAlphabet = lowercaseAlphabets.length > 0
            ? [lowercaseAlphabets.sort().pop()]
            : [];

        res.status(200).json({
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet
        });
    } catch (error) {
        res.status(400).json({ is_success: false, error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
