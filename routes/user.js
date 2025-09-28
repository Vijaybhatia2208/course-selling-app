import express from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../db.js';
import bcrypt from 'bcrypt';
import { verifyJwtUserMiddleware } from '../middleware/userMiddleware.js';
import { jwtUserSecret } from '../config.js';

const userRouter = express.Router()
const saltRounds = 10;


userRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await userModel.findOne({email,});

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

    await userModel.create(payload);
    res.json({
      message: "User created successfully!",
    });
  } catch (err) {
    res.status(400).json({
      message: String(err),
    });
  }
});

userRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({
      email
    });

    if (user) {
      const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;
      if(!isPasswordValid) {
        return res.status(403).json({
          message: "Invalid email or password",
        });
      }
      res.json({
        token: jwt.sign(
          {
            id: user._id,
          },
          jwtUserSecret
        ),
      });
    } else {
      res.status(403).json({
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: String(err),
    });
  }
});

// router.get('/allcourses', (req, res) => {
//   // Fetch all courses logic here
//   res.send('List of all courses');
// });

userRouter.get('/purchases', verifyJwtUserMiddleware, (req, res) => {
  // Fetch user purchases logic here
  res.send('List of user purchases');
});



export { userRouter };