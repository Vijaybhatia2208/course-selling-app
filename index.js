import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import { userRouter } from './routes/user.js';
import { courseRouter } from './routes/course.js';
import { adminRouter } from './routes/admin.js';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();


const PORT = process.env.PORT || 4000;

app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/admin', adminRouter);


console.log("MONGODB_URI:", process.env.MONGODB_URI);
    
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
  console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
