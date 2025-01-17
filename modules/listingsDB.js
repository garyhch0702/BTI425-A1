const mongoose = require("mongoose");
const Listing = require("./listingSchema");

class ListingsDB {
    async initialize(connectionString) {
        await mongoose.connect(connectionString);
        console.log("Database connection successful");
    }
    
    async addNewListing(data) {
        const listing = new Listing(data);
        return listing.save();
    }

    async getAllListings(page, perPage, name) {
        const query = name ? { name: new RegExp(name, "i") } : {};
        return Listing.find(query)
            .sort({ number_of_reviews: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);
    }

    async getListingById(id) {
        return Listing.findById(id);
    }

    async updateListingById(id, data) {
        return Listing.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteListingById(id) {
        return Listing.findByIdAndDelete(id);
    }
}

module.exports = ListingsDB;
