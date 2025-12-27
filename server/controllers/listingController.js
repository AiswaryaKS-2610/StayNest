const fs = require('fs');
const path = require('path');

const getListings = async (req, res) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 200));

        const externalDataPath = path.join(__dirname, '../external_data.json');

        fs.readFile(externalDataPath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading external data file:", err);
                return res.status(500).json({ message: "Failed to load data source" });
            }
            try {
                const listings = JSON.parse(data);
                res.json(listings);
            } catch (parseError) {
                console.error("Error parsing external data JSON:", parseError);
                res.status(500).json({ message: "Data source corruption" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const createListing = (req, res) => {
    const newListing = req.body;
    console.log("New Listing:", newListing);
    res.status(201).json({ message: "Listing created", id: Date.now() });
};

module.exports = { getListings, createListing };
