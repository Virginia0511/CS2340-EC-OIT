const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Root endpoint
app.get('/', (req, res) => {
    // Send the HTML file in response to requests to the root route
    res.sendFile(path.join(__dirname, 'twitchBOT.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
