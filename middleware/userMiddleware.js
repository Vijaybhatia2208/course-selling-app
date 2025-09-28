import * as z from "zod";
import jwt from "jsonwebtoken";
import {jwtUserSecret} from "../config.js";

const User = z.object({
  email : z.email(),
  password: z.string()
});

const verifiyUserCredential = (req, res, next) => {
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

export { verifiyUserCredential, verifyJwtUserMiddleware };