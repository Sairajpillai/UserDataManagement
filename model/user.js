const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    images: [{
      url:String,
      filename:String
    }],
    deleteImages:[]
})

module.exports= mongoose.model('User',userSchema)
