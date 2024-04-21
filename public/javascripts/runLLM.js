// const fetch = require('node-fetch');

const apiUrl = 'http://localhost:5000/generate_content'; // Update the URL with your Flask API URL

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log(data); // Log the response data to the console
        // You can further process the response data here as needed
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
