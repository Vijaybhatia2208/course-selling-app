import { UserModel, TodoModel } from "./db.js";
import { verifiyUserCredential, verifyJwt } from "./middleware.js";
import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import  bcrypt from 'bcrypt';
import cors from "cors";
import  dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 4000;
const saltRounds = 10;
console.log(process.env.MONGODB_URI)
mongoose.connect(
  process.env.MONGODB_URI 
);

app.use(express.json());
app.use(cors())

app.post("/api/signup", verifiyUserCredential, async (req, res) => {
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

app.post("/api/signin", verifiyUserCredential, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
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
          "wrong-secret"
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

app.use(verifyJwt);

app.post("/api/todo", async (req, res) => {
  const { title, done, description } = req.body;
  const { userId } = req.headers;

  const newTask = {
    userId: userId,
    title,
    done,
    description,
  };

  await TodoModel.create(newTask);
  // Here you would typically save the task to a database
  res.status(201).json(newTask);
});

// Read

app.get("/api/todos", async (req, res) => {
  const { userId } = req.headers;
  const allTodo = await TodoModel.find({
    userId: userId,
  });
  // Here you would typically save the task to a database
  res.status(201).json(allTodo);
});

// Delete
app.delete("/api/todo/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedObj = await TodoModel.deleteOne({_id});
    if(!deletedObj) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }
    res.json({ message: "Deleted Succesffully" });
  } catch (err) {
    res.status(400).json({
      message: String(err)
    });
  }
});

app.put("/api/todo/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(req.body, id);
    const updatedData = await TodoModel.findOneAndUpdate({_id}, req.body);
    if(!updatedData) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({
      message: String(err)
    });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});