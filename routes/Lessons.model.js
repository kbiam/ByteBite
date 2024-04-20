const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/NirmaHackathon")

const lessonSchema = new mongoose.Schema({
    lessonName:{
        type : String,
        unique: true
    },
    parentCourseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    },
    videos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Videos'
    }]
})

module.exports = mongoose.model('Lessons', lessonSchema);
