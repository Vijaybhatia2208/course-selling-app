import express from 'express';
import { adminModel } from '../db.js';
const adminRouter = express.Router()


adminRouter.post('/signup', (req, res) => {
  // Signup logic here
  res.send('Admin signed up');
});

adminRouter.post('/signin', (req, res) => {
  // Signin logic here
  res.send('Admin signed in');
});


adminRouter.post('/course', (req, res) => {
  // Course creation logic here
  res.send('Course created');
});

adminRouter.put('/course', (req, res) => {
  // Course update logic here
  res.send('Course updated');
});


adminRouter.get('/course/bulk', (req, res) => {
  // Bulk course retrieval logic here
  res.send('Bulk course data');
});
// router.get('/allcourses', (req, res) => {
//   // Fetch all courses logic here
//   res.send('List of all courses');
// });

adminRouter.get('/purchases', (req, res) => {
  // Fetch user purchases logic here
  res.send('List of user purchases');
});



export { adminRouter };