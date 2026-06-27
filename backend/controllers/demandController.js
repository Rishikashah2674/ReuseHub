const mongoose = require("mongoose");
const Demand = require("../models/Demand");

const createDemand = async (req, res) => {
  try {
    const {
      materialName,
      category,
      quantity,
      unit,
      description,
      location,
      phone,
      email,
      neededBy,
      status,
    } = req.body;

    if (
      !materialName ||
      !category ||
      !quantity ||
      !unit ||
      !description ||
      !location ||
      !phone ||
      !email ||
      !neededBy
    ) {
      return res.status(400).json({
        message: "Please include all required fields",
      });
    }

    const demand = await Demand.create({
      materialName,
      category,
      quantity,
      unit,
      description,
      location,
      phone,
      email,
      neededBy,
      status: status || "open",
      buyer: req.user._id,
      businessName: req.user.businessName || req.user.name || "Buyer",
    });

    const axios = require("axios");

try {

    await axios.post(
        "http://localhost:5000/api/matches/generate",
        {},
        {
            headers:{
                Authorization:
                req.headers.authorization
            }
        }
    );

}
catch(error){

    console.log(
        "Match generation failed:",
        error.message
    );

}


res.status(201).json(demand);
  } catch (error) {
    console.log("Create Demand Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllDemands = async (req, res) => {
  try {
    const demands = await Demand.find().sort({ createdAt: -1 });
    res.status(200).json(demands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyDemands = async (req, res) => {
  try {
    const demands = await Demand.find({ buyer: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(demands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDemand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid demand ID" });
    }

    const demand = await Demand.findById(id);

    if (!demand) {
      return res.status(404).json({ message: "Demand not found" });
    }

    if (demand.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this demand",
      });
    }

    const allowedUpdates = [
      "materialName",
      "category",
      "quantity",
      "unit",
      "description",
      "location",
      "phone",
      "email",
      "neededBy",
      "status",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        demand[field] = req.body[field];
      }
    });

    const updatedDemand = await demand.save();
    res.status(200).json(updatedDemand);
  } catch (error) {
    console.log("Update Demand Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteDemand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid demand ID" });
    }

    const demand = await Demand.findById(id);

    if (!demand) {
      return res.status(404).json({ message: "Demand not found" });
    }

    if (demand.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this demand",
      });
    }

    await demand.deleteOne();

    res.status(200).json({
      message: "Demand deleted successfully",
      id,
    });
  } catch (error) {
    console.log("Delete Demand Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDemand,
  getAllDemands,
  getMyDemands,
  updateDemand,
  deleteDemand,
};