import express from 'express';``
import { adminModel } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtAdminSecret } from '../config.js';
import { verifyJwtAdminMiddleware } from '../middleware/adminMiddleware.js';

const saltRounds = 10;
const adminRouter = express.Router()

adminRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const admin = await adminModel.findOne({email,});

    if (admin) {
      res.status(400).json({
        message: "Admin already exists!",
      });
    }

    const payload = {
      email,
      password: await bcrypt.hash(password, saltRounds),
      name,
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
            id: user._id,
          },
          jwtAdminSecret
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


adminRouter.post('/course', verifyJwtAdminMiddleware, (req, res) => {
  // Course creation logic here
  res.send('Course created');
});

adminRouter.put('/course', verifyJwtAdminMiddleware, (req, res) => {
  // Course update logic here
  res.send('Course updated');
});


adminRouter.get('/course/bulk', verifyJwtAdminMiddleware, (req, res) => {
  // Bulk course retrieval logic here
  res.send('Bulk course data');
});
// router.get('/allcourses', (req, res) => {
//   // Fetch all courses logic here
//   res.send('List of all courses');
// });

adminRouter.get('/purchases', verifyJwtAdminMiddleware, (req, res) => {
  // Fetch user purchases logic here
  res.send('List of user purchases');
});



export { adminRouter };