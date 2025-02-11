const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const cid = '33568454';

// Middleware to obtain a bearer token
async function getBearerToken() {
    const url = 'https://secure2.saashr.com/ta/rest/v1/login';
    const payload = {
        "credentials": {
            "username": "",
            "password": "",
            "company": ""
        }
    };
    const headers = {
        'api-key': '',
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.post(url, payload, { headers });
        return response.data.token;
    } catch (error) {
        console.error('Error obtaining bearer token:', error);
        return null;
    }
}

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/job-requisitions', async (req, res) => {
    const token = await getBearerToken();
    if (!token) {
        return res.status(500).json({ error: 'Unable to obtain bearer token' });
    }

    // const cid = '33568454'; // Replace with your company ID
    const url = `https://secure2.saashr.com/ta/rest/v2/companies/${cid}/recruitment/job-requisitions`;
    const headers = {
        'Authentication': `Bearer ${token}`
    };
    try {
        const response = await axios.get(url, { headers });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching job requisitions:', error);
        res.status(500).json({ error: 'Error fetching job requisitions' });
    }
});

app.get('/api/job-requisitions/:id', async (req, res) => {
    const token = await getBearerToken();
    if (!token) {
        return res.status(500).json({ error: 'Unable to obtain bearer token' });
    }

    // const cid = 'your_company_id'; // Replace with your company ID
    const id = req.params.id;
    const url = `https://secure2.saashr.com/ta/rest/v2/companies/${cid}/recruitment/job-requisitions/${id}`;
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.get(url, { headers });
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching job requisition ${id}:`, error);
        res.status(500).json({ error: `Error fetching job requisition ${id}` });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
