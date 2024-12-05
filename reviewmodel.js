const { default: mongoose } = require("mongoose")

 const reviewSchema = mongoose.Schema({
    taskprovider:{
        type: String,
        required: true,
    },
    taskworker :{
        type:String,
        required: true,
    },
    rating :{
        type: String,
        required: true
    }
 })
 module.exports = mongoose.model('review', reviewSchema);