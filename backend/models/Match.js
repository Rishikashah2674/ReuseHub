const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    demand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Demand",
      required: true,
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteListing",
      required: true,
    },

    // AI generated matching percentage
    matchScore: {
      type: Number,
      required: true,
    },


    // Why AI suggested this match
    matchReason: {
      type: [String],
      default: [],
    },


    // Match workflow status
    status: {
      type: String,
      enum: [
        "pending",
        "accepted_by_buyer",
        "accepted_by_supplier",
        "completed",
        "rejected"
      ],
      default: "pending",
    },


    // Optional deal completion details
    dealDate: {
      type: Date,
    },


    // Stores messages/notes between supplier and buyer later
    conversation: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        message: {
          type: String,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],

  },
  {
    timestamps: true,
  }
);


// Frontend compatibility
matchSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});


module.exports = mongoose.model("Match", matchSchema);