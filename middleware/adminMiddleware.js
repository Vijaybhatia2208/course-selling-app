import * as z from "zod";
import jwt from "jsonwebtoken";
import {jwtAdminSecret} from "../config.js";

const Admin = z.object({
  email : z.email(),
  password: z.string()
});

const verifiyAdminCredential = (req, res, next) => {
  try {
    const {email, password} = req.body; 
    Admin.parse({
      email,
      password
    })

    next()
  } catch(err) {
    return res.status(400).json({...err});
  }
}


const verifyJwtAdminMiddleware = (req, res, next) => {
  try {
    const token = req.headers['auth_token'];
    console.log(token);
    const decoded = jwt.verify(token, jwtAdminSecret);
    req.headers.userId = decoded._id;
    next();
  } catch(err) {
    console.log(err);
    return res.status(401).json({
      message: "Invalid Token!"
    })
  }
};

export { verifiyAdminCredential, verifyJwtAdminMiddleware };