var mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
    id: Number,
    productid: Number,
    name: String,
    invoiceno: String,
    date: Date,
    cost: String,
    ownedby: String,
    purpose: String,
    workingcondition: String
    
});

module.exports = mongoose.model('product',productSchema);
