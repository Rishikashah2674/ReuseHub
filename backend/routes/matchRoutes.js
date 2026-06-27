const express = require("express");

const router = express.Router();


const {
    generateMatches,
    getMatchesForBuyer,
    updateMatchStatus
} = require("../controllers/matchController");


const { protect } = require("../middleware/authMiddleware");



// Generate AI matches
// POST /api/matches/generate

router.post(
    "/generate",
    protect,
    generateMatches
);



// Get matches for logged-in buyer
// GET /api/matches/my

router.get(
    "/my",
    protect,
    getMatchesForBuyer
);



// Accept / Reject match
// PUT /api/matches/:id/status

router.put(
    "/:id/status",
    protect,
    updateMatchStatus
);



module.exports = router;