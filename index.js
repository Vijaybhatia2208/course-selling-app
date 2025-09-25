import express from 'express';
import cors from "cors";
import { userRouter } from './routes/user.js';
import { courseRouter } from './routes/course.js';
import { adminRouter } from './routes/admin.js';

const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3000;

app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//   /user/signup/
// /user/signin/
// /user/purchases/
// /course/purchase/
// /course/preview/
