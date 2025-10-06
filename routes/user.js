import express from 'express';
import jwt from 'jsonwebtoken';
import { courseModel, purchaseModel, userModel } from '../db.js';
import bcrypt from 'bcrypt';
import { verifyJwtUserMiddleware, verifyUserCredential } from '../middleware/userMiddleware.js';
import { jwtUserSecret } from '../config.js';
import * as z from "zod";

const userRouter = express.Router()
const saltRounds = 10;

const adminSchema = z.object({
  email : z.email(),
  password: z.string().min(4),
  firstName: z.string().min(1),
  lastName: z.string().min(1)  
});

userRouter.post('/signup',verifyUserCredential, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    adminSchema.parse({
      email, password, firstName, lastName
    });
    const user = await userModel.findOne({email,});

    if (user) {
      res.status(400).json({
        message: "User already exists!",
      });
    }

    const payload = {
      email,
      password: await bcrypt.hash(password, saltRounds),
      firstName,
      lastName,
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

userRouter.post('/signin', verifyUserCredential, async (req, res) => {
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

userRouter.get('/purchases', verifyJwtUserMiddleware, async (req, res) => {
  const userId = req.headers.userId;

  const allPurchases = await purchaseModel.findMany({
    userId: userId
  });

  const allCourses = [];

  allPurchases.map(async purchase => {  // query need to be optimize
    const course = await courseModel.findById(courseId);
    allCourses.push(course)
  })
  res.send(allCourses);
});



export { userRouter };