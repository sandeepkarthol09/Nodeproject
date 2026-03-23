const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    avatar: {
      type: String, // URL to the profile picture
      default: "",
    },

    age: {
      type: Number,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
      website: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
