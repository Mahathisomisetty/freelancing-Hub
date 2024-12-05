const mongoose = require('mongoose');
const devUser=new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
        
    },
    phonenumber:{
        type:String,
        required:true
    },
    skills:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('devUser',devUser)