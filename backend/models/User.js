const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    businessCategory: {
      type: String,
      required: true,
      enum: [
        "Cafe & Restaurant",
        "Tailoring & Textile Shop",
        "Printing Shop",
        "Workshop & Carpentry",
        "Flower Shop",
        "Farm & Compost Business",
        "Recycling Unit",
        "Packaging Business",
        "Other",
      ],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    accountType: {
      type: String,
      required: true,
      enum: ["buyer", "supplier"],
    },

    role: {
      type: String,
      enum: ["business", "admin"],
      default: "business",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);