import express from 'express';

import { UserModel } from '../db.js';
import bcrypt from 'bcrypt';
const userRouter = express.Router()


userRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await UserModel.findOne({email,});

    if (user) {
      res.status(400).json({
        message: "User already exists!",
      });
    }

    const payload = {
      email,
      password: await bcrypt.hash(password, saltRounds),
      name,
    }

    await UserModel.create(payload);
    res.json({
      message: "User created successfully!",
    });
  } catch (err) {
    res.status(400).json({
      message: String(err),
    });
  }
});

userRouter.post('/signin', (req, res) => {
  // Signin logic here
  res.send('User signed in');
});

// router.get('/allcourses', (req, res) => {
//   // Fetch all courses logic here
//   res.send('List of all courses');
// });

userRouter.get('/purchases', (req, res) => {
  // Fetch user purchases logic here
  res.send('List of user purchases');
});



export { userRouter };