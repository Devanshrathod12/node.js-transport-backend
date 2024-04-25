// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import APIError from "../helper/ApiError.js";
import httpStatus from "http-status";
import { db } from "../../config/sequelize.js";
import config from "../../config/config.js";
import * as authModelHelper from "../ModelHelper/auth.modelHelper.js";

const User = db.User;

async function register(req, res, next) {
  try {
    const { username, password, email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.status(208).json({
        'status': 'ERROR',
        'message': "USER ALREADY EXIST"
    });
    next();
    } else {
      const newUser = await User.create({ username, email, password }); // Use the User model to create a new user
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const passwordCompare = await new Promise((resolve) =>
        resolve(bcrypt.compare(password, user.password))
      );

      if (passwordCompare) {
        const log = await authModelHelper.checkSessionLog(user.id);
        if (log) {
          res.json({
            message: "User Login Successfully",
            token: log.token,
            user,
          });
        } else {
          const token = jwt.sign(
            {
              id: user.id,
            },
            config.secretKey
          );
          const created = await authModelHelper.createSessionLog(
            token,
            user.id
          );
          if (created) {
            res.json({ token, user });
          } else {
            res.status(500).json({
              'status': 'ERROR',
              'message': "Some error occured, please try again!!"
          });
          next();
          }
        }
      } else {  
       res.status(401).json({
          'status': 'ERROR',
          'message': "Invalid User!!"
        });
        next();
      }
    } else {
      // const err = new APIError(
      //   "User not found !!",
      //   httpStatus.BAD_REQUEST,
      //   true
      // );
      // next(err);
      res.status(500).json({
        'status': 'ERROR',
        'message': "User not found"
    });
    }
  } catch (err) {
    // const error = new APIError(err, httpStatus.BAD_REQUEST, true);
    // next(error);
    res.status(500).json({
      'status': 'ERROR',
      'message': err || err.toString()
  });
  }
}

export { register, login };
