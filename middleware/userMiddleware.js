import * as z from "zod";
import jwt from "jsonwebtoken";
import {jwtUserSecret} from "../config.js";

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

const sendOtp = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "",
    pass: "",
  },
});

// Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from: '"littleGiant" <email>',
    to: "bar@example.com, baz@example.com",
    subject: "Hello ✔",
    text: "Hello world?", // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent:", info.messageId);
})();

export { verifyUserCredential, verifyJwtUserMiddleware };