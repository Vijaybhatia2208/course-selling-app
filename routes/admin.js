import express from 'express';``
import { adminModel } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtAdminSecret } from '../config.js';
import { verifyJwtAdminMiddleware } from '../middleware/adminMiddleware.js';
import * as z from "zod";
import { courseModel } from '../db.js';

const saltRounds = 10;
const adminRouter = express.Router()

const adminSchema = z.object({
  email : z.email(),
  password: z.string().min(4),
  firstName: z.string().min(1),
  lastName: z.string().min(1)  
});

adminRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    adminSchema.parse({
      email, password, firstName, lastName
    });

    const admin = await adminModel.findOne({email,});

    if (admin) {
      res.status(400).json({
        message: "Admin already exists!",
      });
    }

    const payload = {
      email,
      password: await bcrypt.hash(password, saltRounds),
      firstName,
      lastName
    }

    await adminModel.create(payload);
    res.json({
      message: "Admin created successfully!",
    });
  } catch (err) {
    res.status(400).json({
      message: String(err),
    });
  }
});

adminRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({
      email
    });

    if (admin) {
      const isPasswordValid = admin ? await bcrypt.compare(password, admin.password) : false;
      if(!isPasswordValid) {
        return res.status(403).json({
          message: "Invalid email or password",
        });
      }
      res.json({
        token: jwt.sign(
          {
            _id: admin._id,
          },
          jwtAdminSecret
        ),
        details: admin
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


adminRouter.post('/course', verifyJwtAdminMiddleware, async (req, res) => {
  try {
    const adminId = req.headers.adminId;
    const { title, description, price, imageUrl } = req.body;
    CourseSchema.parse({
      title, description, price, imageUrl 
    });

    console.log(adminId);

    const dbResponse = await courseModel.create({
      title, 
      description, 
      price, 
      imageUrl,
      creatorId: adminId
    })
    console.log(dbResponse);
    res.status(200).json(dbResponse);
  } catch(err) {
    res.status(400).json({error: String(err)});
  }

});

const CourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  imageUrl: z.string().url()
});

adminRouter.put('/course/:_id', verifyJwtAdminMiddleware, async (req, res) => {
  // Course update logic here

  try {
    const {_id} = req.params;
    const dbResponse  = await courseModel.findOneAndUpdate({_id}, req.body);
    if(!response) {
      return res.status(404).json({error: "Course not found!"});
    }
    res.status(200).send(dbResponse);
  } catch(err) {
    res.status(400).json({error: JSON.stringify(err)});
  }
});


adminRouter.get('/course/bulk', verifyJwtAdminMiddleware, async (req, res) => {
  try {
    const adminId = req.headers.adminId;
    const dbResponse  = await courseModel.findMany({creatorId: adminId});
    if(!response) {
      return res.status(200).json([]);
    }
    res.status(200).send(dbResponse);
  } catch(err) {
    res.status(400).json({error: JSON.stringify(err)});
  }
});


export { adminRouter };