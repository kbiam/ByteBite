const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/NirmaHackathon")

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    courses_enrolled: [
        { type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' 
    }],
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    password:{
        type:String,
        required:[true,"Why you no"]
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model('User', userSchema);
