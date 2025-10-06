import * as z from "zod";
import jwt from "jsonwebtoken";
import {jwtUserSecret} from "../config.js";
import nodemailer from "nodemailer";

const User = z.object({
  email : z.email(),
  password: z.string()
});

const verifyUserCredential = (req, res, next) => {
  try {
    const {email, password} = req.body; 
    User.parse({
      email,
      password
    })

    next()
  } catch(err) {
    return res.status(400).json({...err});
  }
}


const verifyJwtUserMiddleware = (req, res, next) => {
  try {
    const token = req.headers['auth_token'];
    console.log(token);
    const decoded = jwt.verify(token, jwtUserSecret);
    req.headers.userId = decoded._id;
    next();
  } catch(err) {
    console.log(err);
    return res.status(401).json({
      message: "Invalid Token!"
    })
  }
};


// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "walter.bernier@ethereal.email",
    pass: "auHCNbRSNw1hMr19VC",
  },
});

// Wrap in an async IIFE so we can use await.
const sendMail = async (toEmailId, subject, test, html) => {
  const info = await transporter.sendMail({
    from: `"littleGiant" <vijaybhatia2023@gmail.com>`,
    to: toEmailId,
    subject: subject,
    text: text,
    html: html,
  });

  console.log("Message sent:", info.messageId);
};

export { verifyUserCredential, verifyJwtUserMiddleware,sendMail };