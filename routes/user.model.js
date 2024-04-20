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
    current_lesson:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Lessons'
        }
    ],
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    password:{
        type:String,
        required:[true,"Why you no"]
    },
    progress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Progress',
    },
},
{
    timestamps:true
}
)

module.exports = mongoose.model('User', userSchema);
