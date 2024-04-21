var express = require('express');
var router = express.Router();
const userSchema = require('./user.model.js')
const courseSchema = require('./Course.model.js')
const lessonSchema = require('./Lessons.model.js')
const videoSchema = require('./Videos.model.js')
/* GET home page. */
router.get('/registration', function(req, res, next) {
  res.render('index', { title: 'Express',error:'' });
});
router.post('/userRegistration',function(req,res){
  const Username = req.body.Username
  const Email = req.body.Email
  const Password = req.body.Password
  req.session.username = Username

  console.log(req.session.username)


  const newUser = new userSchema({
    userName:Username,
    email:Email,
    password:Password
  });
  newUser.save()
  .then(savedUser => {
    console.log('User registration successful:', savedUser);
    res.redirect('/objectives')
    // res.status(200).json({ message: 'User registered successfully', user: savedUser });
  })
  .catch(error => {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  });

})

// router.get('/userLogin',function(req,res){
//   res.render('userLogin',{error:''})
// })
router.post('/login', async function(req, res) {
  const username = req.body.Username
  const password = req.body.Password


  try {
      // Find the user by username
      const user = await userSchema.findOne({ userName: username });

      if (!user) {
          // If user not found, render login page with error message
          return res.redirect('/registration');
      }

      // Compare the provided password with the stored password
      if (password !== user.password) {
          // If password doesn't match, render login page with error message
          return res.redirect('/registration');
      }

      // If password matches, create a session to keep the user logged in
      req.session.username = username;

      // Redirect the user to the dashboard or home page upon successful login
      res.redirect('/content'); // Change '/dashboard' to your desired URL
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/intropage',function(req,res){
  res.render('intropage')
})
router.get('/objectives',async function(req,res){
  const courses = await courseSchema.find()

  res.render('objectives',{courses:courses})
})

router.post('/courseenrollment',async function(req,res){
  console.log(req.session.username)
  const coursenames = req.body.courses
  // console.log(coursenames)
  const courses = await courseSchema.find({ courseName: { $in: coursenames } });
    
  // Extract IDs of the found courses
  const courseIds = courses.map(course => course._id);
  await userSchema.updateOne(
    { userName: req.session.username }, // assuming you have a userName field in the request body
    { $addToSet: { courses_enrolled: { $each: courseIds } } } // $addToSet ensures unique entries
  );
  console.log(courseIds)
  res.sendStatus(200)
})
router.get('/content', isLoggedIn, async function(req, res) {
  const username = req.session.username;

  try {
      // Find the user by username and populate the enrolled courses
      const user = await userSchema.findOne({ userName: username }).populate({
          path: 'courses_enrolled',
          populate: {
              path: 'courseLessons', // Populate the lessons for each enrolled course
              select: 'lessonName thumbnail' // Select only lessonName and thumbnail fields
          }
      });

      if (!user) {
          // If user is not found, handle the error
          return res.status(404).json({ message: 'User not found' });
      }

      // Extract the enrolled courses with their lessons
      const enrolledCourses = user.courses_enrolled.map(course => {
          return {
              courseName: course.courseName,
              lessons: course.courseLessons.map(lesson => {
                  return {
                      lessonName: lesson.lessonName,
                      thumbnail: lesson.thumbnail
                  };
              })
          };
      });

      res.render('content', { enrolledCourses: enrolledCourses });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/lesson/:lessonName', isLoggedIn,async function(req, res) {
  const lessonName = req.params.lessonName;
  console.log(lessonName)

  try {
    // Retrieve the lesson based on the provided lessonName
    const lesson = await lessonSchema.findOne({ lessonName }).populate('videos');
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Extract the video data
    const videos = lesson.videos.map(video => {
      return {
        url: video.url,
        transcript: video.transcript // Include other relevant video properties if needed
      };
    });
    videos.forEach(function(video){
      console.log(video.url)

    })

    // Render the EJS template with the videos data
    res.render('lesson', { videos: videos, lessonName: lessonName });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }


})
router.get('/quiz',async function(req,res){
  res.render('quiz')
})
router.post('/quiz/transcripts', async function(req, res) {
  try {
      const lessonName = req.body.lessonName; 
      const decodedLessonName = decodeURIComponent(lessonName.replace(/\+/g, ' '));
      
      // Find the lesson document based on the decoded lesson name
      const lesson = await lessonSchema.findOne({ lessonName: decodedLessonName }).populate('videos');
      
      if (!lesson) {
          return res.status(404).json({ message: 'Lesson not found' });
      }
      
      // Extract the videos and their transcripts
      const videosWithTranscripts = lesson.videos.map(video => {
          return {
              url: video.url,
              transcript: video.transcript
          };
      });
      console.log(videosWithTranscripts)

      // Return the videos and their transcripts
      res.json(videosWithTranscripts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/dsd/quiz',function(req,res){
  res.render('quiz')
})


//POSTMAN//
router.post('/addVid', async function(req, res) {
  const videos = req.body.videos;
  const lessonName = req.body.lessonName;

  try {
      // Find the lesson document that matches the provided lessonName
      const lesson = await lessonSchema.findOne({ lessonName });

      if (!lesson) {
          return res.status(404).json({ message: 'Lesson not found' });
      }

      // Assuming videos is an array of objects containing video information (url, transcript, etc.)
  
          // Create a new video document
          const video = new videoSchema({
              url: videos,
              lessonId: lesson._id // Assign the lessonId to the video's lessonId field
          });

          // Save the video document to the database
          await video.save();
          lesson.videos.push(video._id);
          await lesson.save()

  

      res.sendStatus(200); // Sending a success response
  } catch (error) {
      console.error('Error adding video:', error);
      res.status(500).json({ message: 'Error adding video' });
  }
});


function isLoggedIn(req,res,next){
  if(req.session.username){
    next()
  }
  else{
    res.redirect('/userLogin')
  }
}


// router.post('/addLesson', async function(req, res) {
//   const lessonName = req.body.lessonName;
//   const courseName = req.body.courseName;
//   const thumbnail = req.body.thumbnail

//   try {
//       // Find the course document that matches the provided courseName
//       const course = await courseSchema.findOne({ courseName });

//       if (!course) {
//           return res.status(404).json({ message: 'Course not found' });
//       }

//       // Create a new lesson document
//       const lesson = new lessonSchema({
//           lessonName,
//           courseName: course._id,
//           thumbnail:thumbnail // Assign the courseId to the lesson's courseName field
//           // Assuming videos are passed in the request body, add them here if needed
//           // videos: req.body.videos
//       });

//       // Save the lesson document to the database
//       await lesson.save();

//       // Push the lesson's ID to the courseLessons array in the course document
//       course.courseLessons.push(lesson._id);

//       // Save the updated course document
//       await course.save();

//       res.sendStatus(200); // Sending a success response
//   } catch (error) {
//       console.error('Error adding lesson:', error);
//       res.status(500).json({ message: 'Error adding lesson' });
//   }
// });

// router.post('/courseadd',function(req,res){
//   const courseId = req.body.Username
//   const Instructor = req.body.Instructor
//   const courseName = req.body.courseName

//   const newcourse = new courseSchema({
//     Instructor:Instructor,
//     courseName:courseName
//   });
//   newcourse.save()
//   .then(savedUser => {
//     console.log('course registration successful:', savedUser);
//     res.status(200).json({ message: 'course registered successfully', user: savedUser });
//   })
//   .catch(error => {
//     console.error('Error registering course:', error);
//     res.status(500).json({ message: 'Error registering course' });
//   });
// })

module.exports = router;
