import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

// Schemas =>
import User from "./Schema/User.js";

const server = express();
let PORT = 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// json parser
server.use(express.json());
mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};
const generateUserName = async (email) => {
  let username = email.split("@")[0];

  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameNotUnique ? (username += nanoid().substring(0, 4)) : "";

  return username;
};

// SignUp
server.post("/signup", async (req, res) => {
  let { fullname, email, password } = req.body;

  // Validate the data from the frontend
  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 letters long" });
  }
  if (!email.length) {
    return res.status(403).json({ Success: false, error: "Enter Email" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ Success: false, error: "Invalid Email" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      Success: false,
      error:
        "Password must be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter",
    });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ "personal_info.email": email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Email already exists. Please use a different email." });
    }

    // Hash the password
    bcrypt.hash(password, 10, async (error, hashed_password) => {
      if (error) {
        return res.status(500).json({ error: "Error hashing password" });
      }

      let username = await generateUserName(email);
      console.log(hashed_password, username);
      // Creating a user object
      let user = new User({
        personal_info: { fullname, email, password: hashed_password, username },
      });

      user
        .save()
        .then((user) => {
          return res.status(200).json(formatDataToSend(user));
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// SignIn
server.post("/signin", (req, res) => {
    let { email, password } = req.body;
  
    User.findOne({ "personal_info.email": email })
      .then((user) => {
        if (!user) {
          return res.status(403).json({
            success: false,
            error: "Email not found"
          });
        }
  
        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.personal_info.password, (error, result) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: "An error occurred while logging in, please try again."
            });
          }
  
          if (!result) {
            return res.status(403).json({
              success: false,
              message: "Incorrect password"
            });
          }
  
          // If password comparison is successful
          return res.status(200).json(formatDataToSend(user));
        });
  
        // Remove this part to avoid sending multiple responses
        // console.log(user);
        // return res.json({
        //   success: true,
        //   message: "Successfully retrieved user data",
        // });
      })
      .catch((error) => {
        console.log(error.message);
        return res.status(500).json({
          success: false,
          error: error.message,
        });
      });
  });
  
  

server.listen(PORT, () => {
  console.log("Listening on port -> " + PORT);
});
