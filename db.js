import mongoose from "mongoose";
const {Schema, model, ObjectId} = mongoose;
import dotenv from 'dotenv';
dotenv.config();

console.log("MONGODB_URI:", process.env.MONGODB_URI);
    
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});


const Admin = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

const Course = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    imageUrl: {type: String},
    creatorId: {type: ObjectId, ref: 'Admin', required: true},
    createdAt: {type: Date, default: Date.now}
});

const Purchase = new Schema({
    userId: {type: ObjectId, ref: 'User', required: true},
    courseId: {type: ObjectId, ref: 'Course', required: true},
    purchaseDate: {type: Date, default: Date.now}
});

const userModel = model('User', User);
const adminModel = model('Admin', Admin);
const courseModel = model('Course', Course);
const purchaseModel = model('Purchase', Purchase);

export { userModel, adminModel, courseModel, purchaseModel };
