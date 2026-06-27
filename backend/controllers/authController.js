const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const {
  businessName,
  ownerName,
  email,
  password,
  phone,
  businessCategory,
  location,
  accountType,
} = req.body;
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
  businessName,
  ownerName,
  email,
  password: hashedPassword,
  phone,
  businessCategory,
  location,
  accountType,
});
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        businessName: user.businessName,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone,
        businessCategory: user.businessCategory,
        location: user.location,
        role: user.role,
        accountType: user.accountType,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Backend registration error details:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
  _id: user._id,
  businessName: user.businessName,
  ownerName: user.ownerName,
  email: user.email,
  phone: user.phone,
  businessCategory: user.businessCategory,
  location: user.location,
  accountType: user.accountType,
  role: user.role,
},
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get logged-in user profile
const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.businessName = req.body.businessName || user.businessName;
    user.ownerName = req.body.ownerName || user.ownerName;
    user.phone = req.body.phone || user.phone;
    user.businessCategory = req.body.businessCategory || user.businessCategory;
    user.location = req.body.location || user.location;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
  _id: updatedUser._id,
  businessName: updatedUser.businessName,
  ownerName: updatedUser.ownerName,
  email: updatedUser.email,
  phone: updatedUser.phone,
  businessCategory: updatedUser.businessCategory,
  location: updatedUser.location,
  accountType: updatedUser.accountType,
  role: updatedUser.role,
},
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};