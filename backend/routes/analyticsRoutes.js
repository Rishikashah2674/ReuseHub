const express = require("express");
const User = require("../models/User");
const WasteListing = require("../models/WasteListing");
const Demand = require("../models/Demand");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const colors = ["#10B981", "#14B8A6", "#6366F1", "#F59E0B", "#EF4444", "#8B5CF6"];

const getNumber = (value) => Number(value) || 0;

const buildMonthlyData = (items) => {
  const monthly = {};

  items.forEach((item) => {
    const date = item.createdAt ? new Date(item.createdAt) : new Date();
    const month = monthNames[date.getMonth()];
    const quantity = getNumber(item.quantity);

    if (!monthly[month]) {
      monthly[month] = {
        month,
        weight: 0,
        co2: 0,
      };
    }

    monthly[month].weight += quantity;
    monthly[month].co2 += Number((quantity * 0.44).toFixed(2));
  });

  return Object.values(monthly);
};

const buildCategoryData = (items) => {
  const categoryMap = {};

  items.forEach((item) => {
    const category = item.category || "Other";
    const quantity = getNumber(item.quantity);

    categoryMap[category] = (categoryMap[category] || 0) + quantity;
  });

  const total = Object.values(categoryMap).reduce((sum, value) => sum + value, 0);

  return Object.entries(categoryMap).map(([name, value], index) => ({
    name,
    value: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
    color: colors[index % colors.length],
  }));
};

router.get("/", protect, async (req, res) => {
  try {
    const user = req.user;

    if (user.accountType === "supplier") {
      const myListings = await WasteListing.find({ user: user._id }).sort({
        createdAt: 1,
      });

      const totalQuantityListed = myListings.reduce((total, item) => {
        return total + getNumber(item.quantity);
      }, 0);

      const activeListings = myListings.filter(
        (item) =>
          item.status === "available" ||
          item.status === "active" ||
          !item.status
      ).length;

      return res.json({
        role: "supplier",
        title: "Supplier Analytics",
        cards: {
          card1Label: "Estimated CO₂ Saved",
          card1Value: Number((totalQuantityListed * 0.44).toFixed(2)),
          card1Unit: "kg",

          card2Label: "Total Quantity Listed",
          card2Value: totalQuantityListed,
          card2Unit: "kg",

          card3Label: "Active Listings",
          card3Value: activeListings,
          card3Unit: "",

          card4Label: "My Listings",
          card4Value: myListings.length,
          card4Unit: "",
        },
        monthlyData: buildMonthlyData(myListings),
        categoryData: buildCategoryData(myListings),
      });
    }

    if (user.accountType === "buyer") {
      const myDemands = await Demand.find({ buyer: user._id }).sort({
        createdAt: 1,
      });

      const totalQuantityRequested = myDemands.reduce((total, item) => {
        return total + getNumber(item.quantity);
      }, 0);

      const openDemands = myDemands.filter(
        (item) => item.status === "open" || !item.status
      ).length;

      return res.json({
        role: "buyer",
        title: "Buyer Analytics",
        cards: {
          card1Label: "Estimated CO₂ Impact",
          card1Value: Number((totalQuantityRequested * 0.44).toFixed(2)),
          card1Unit: "kg",

          card2Label: "Total Quantity Requested",
          card2Value: totalQuantityRequested,
          card2Unit: "kg",

          card3Label: "Open Demands",
          card3Value: openDemands,
          card3Unit: "",

          card4Label: "My Demands",
          card4Value: myDemands.length,
          card4Unit: "",
        },
        monthlyData: buildMonthlyData(myDemands),
        categoryData: buildCategoryData(myDemands),
      });
    }

    const registeredBusinesses = await User.countDocuments();
    const totalDemands = await Demand.countDocuments();
    const listings = await WasteListing.find();

    const totalWasteListed = listings.reduce((total, item) => {
      return total + getNumber(item.quantity);
    }, 0);

    return res.json({
      role: "global",
      title: "Platform Analytics",
      cards: {
        card1Label: "Estimated CO₂ Saved",
        card1Value: Number((totalWasteListed * 0.44).toFixed(2)),
        card1Unit: "kg",

        card2Label: "Total Waste Listed",
        card2Value: totalWasteListed,
        card2Unit: "kg",

        card3Label: "Total Demands",
        card3Value: totalDemands,
        card3Unit: "",

        card4Label: "Registered Businesses",
        card4Value: registeredBusinesses,
        card4Unit: "",
      },
      monthlyData: buildMonthlyData(listings),
      categoryData: buildCategoryData(listings),
    });
  } catch (error) {
    console.log("Analytics Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;