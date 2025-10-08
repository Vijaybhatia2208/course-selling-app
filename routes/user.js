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

userRouter.post('/purchaseCourse', async (req, res) => {
  try {
    await userModel.updateMany({}, { $set: { purchasedCourses: [] } });
    const userId = req.headers.userId;
    const { courseId } = req.body;
    const user = await userModel.findById(userId);
  
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!"
      });
    }

    if(user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({
        message: "Course already purchased!"
      });
    }
  
    await userModel.findByIdAndUpdate(userId, { $addToSet: { purchasedCourses: courseId }});
    
    res.send({
      "message": "Courses purchased successfully !"
    })
  } catch(err) {
    res.status(400).send({
      "message": err
    })
    console.log("Error: ", err);
  }
});

userRouter.get('/purchaseCourses', verifyJwtUserMiddleware, async (req, res) => {
  try {
    const userId = req.headers.userId;

    const user = await userModel.findById(userId)
    .populate('purchasedCourses'); 
    //  Use .populate() to fetch the full Course documents
    // The 'purchasedCourses' field holds the ObjectIds, and 'Course' is the ref name.

    if (!user) {
      return res.status(404).json({
        message: "User not found!"
      });
    }

    // 3. Extract the populated courses from the user document
    const purchasedCourses = user.purchasedCourses;

    res.status(200).json({
      message: "Purchased courses retrieved successfully.",
      purchasedCourses: purchasedCourses
    });

  } catch(err) {
    console.error("Error fetching purchased courses: ", err);
    res.status(500).json({
      message: "An error occurred while fetching purchased courses."
    });
  }
});

userRouter.use((req, res) => {
  res.status(404).json({ message: "User Route not found" });
});



export { userRouter };