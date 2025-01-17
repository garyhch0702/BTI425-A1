const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
    name: String,
    summary: String,
    bedrooms: Number,
    bathrooms: Number,
    number_of_reviews: Number,
});

module.exports = mongoose.model("Listing", ListingSchema);
