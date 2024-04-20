const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/NirmaHackathon")


const videoSchema = new mongoose.Schema({
    url:{
        type:String,
        unique:true,
        required:true
    },
    lessonId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lessons'
        
    },
    transcript:{
        type:String
    }
})
module.exports = mongoose.model('Videos', videoSchema);
