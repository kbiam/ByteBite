var express = require('express');
var router = express.Router();
const userSchema = require('./user.model.js')
const courseSchema = require('./Course.model.js')

/* GET home page. */
router.get('/registration', function(req, res, next) {
  res.render('index', { title: 'Express',error:'' });
});
router.post('/userRegistration',function(req,res){
  const Username = req.body.Username
  const Email = req.body.Email
  const Password = req.body.Password

  const newUser = new userSchema({
    userName:Username,
    email:Email,
    password:Password
  });
  newUser.save()
  .then(savedUser => {
    console.log('User registration successful:', savedUser);
    res.status(200).json({ message: 'User registered successfully', user: savedUser });
  })
  .catch(error => {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  });

})

router.get('/userLogin',function(req,res){
  res.render('userLogin',{error:''})
})
router.get('/intropage',function(req,res){
  res.render('intropage')
})
router.get('/objectives',async function(req,res){
  const courses = await courseSchema.find()

  res.render('objectives',{courses:courses})
})
router.post('/courseadd',function(req,res){
  const courseId = req.body.Username
  const Instructor = req.body.Instructor
  const courseName = req.body.courseName

  const newcourse = new courseSchema({
    Instructor:Instructor,
    courseName:courseName
  });
  newcourse.save()
  .then(savedUser => {
    console.log('course registration successful:', savedUser);
    res.status(200).json({ message: 'course registered successfully', user: savedUser });
  })
  .catch(error => {
    console.error('Error registering course:', error);
    res.status(500).json({ message: 'Error registering course' });
  });
})
module.exports = router;
