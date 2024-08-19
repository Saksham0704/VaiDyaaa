import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, gender, photo } = req.body;
  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    } else if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    if (!user) {
      throw new Error("User object is null");
    }
    await user.save();
    res.status(200).json({ success: true, message: "User successfully created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = null;
      const patient = await User.findOne({ email });
      const doctor = await Doctor.findOne({ email });
  
      if (patient) {
        user = patient;
      } else if (doctor) {
        user = doctor;
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password); // Corrected line
  
      if (!isPasswordMatch) {
        return res.status(400).json({ status: false, message: "Invalid credentials" });
      }
  
      const token = generateToken(user);
  
      const { password: _, role, appointment, ...rest } = user._doc;
  
      res.status(200).json({
        status: true,
        message: "Successfully logged in",
        token,
        data: { ...rest },
        role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: "Failed to login" });
    }
  };
  