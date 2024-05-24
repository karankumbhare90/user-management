const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true 
    },

    lastName : {
        type : String,
        required : true 
    },
    
    contactNo : {
        type : String,
        required : true 
    },

    email : {
        type : String,
        required : true,
    },

    details : {
        type : String,
    },

    createdAt : {
        type : Date,
        default : Date.now()
    },

    updatedAt : {
        type : Date,
        default : Date.now()
    },
})

module.exports = mongoose.model('Customers', CustomerSchema);