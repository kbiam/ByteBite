const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/NirmaHackathon")

const courseSchema = new mongoose.Schema({

    Instructor:{
        type:String,
        required:true,
        trim:true,
    },
    students_enrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    }],
    courseName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },

    courseLessons:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Lessons'
    }]
    
},{
    timestamps:true
})

module.exports = mongoose.model('Course', courseSchema);
