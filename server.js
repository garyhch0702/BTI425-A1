/********************************************************************************
*  BTI425 – Assignment 1
*  
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*  
*  Name: Chenghao Hu
*  Student ID: 149773228
*  Date: January 16, 2025
*  
*  Published URL: ___________________________________________________________
********************************************************************************/

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ListingsDB = require("./modules/listingsDB");

dotenv.config();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const db = new ListingsDB();

db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err);
    });

app.post("/api/listings", async (req, res) => {
    try {
        const listing = await db.addNewListing(req.body);
        res.status(201).json(listing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/listings", async (req, res) => {
    try {
        const { page = 1, perPage = 5, name } = req.query;
        const listings = await db.getAllListings(+page, +perPage, name);
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/listings/:id", async (req, res) => {
    try {
        const listing = await db.getListingById(req.params.id);
        if (!listing) return res.status(404).json({ error: "Listing not found" });
        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/listings/:id", async (req, res) => {
    try {
        const updatedListing = await db.updateListingById(req.params.id, req.body);
        if (!updatedListing) return res.status(404).json({ error: "Listing not found" });
        res.json(updatedListing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/listings/:id", async (req, res) => {
    try {
        const deletedListing = await db.deleteListingById(req.params.id);
        if (!deletedListing) return res.status(404).json({ error: "Listing not found" });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
