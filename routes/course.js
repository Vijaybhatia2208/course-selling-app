import express from 'express';


const courseRouter = express.Router()


courseRouter.post('/purchase', (req, res) => {
  // Course purchase logic here
  res.send('Course purchased');
});

courseRouter.get('/preview', (req, res) => {
  // Course preview logic here
  res.send('Course preview');
});

export { courseRouter };