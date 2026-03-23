const profileService = require("../services/profileService");
const response = require("../utils/responseHandler");
const asyncHandler = require("../middlewares/asyncHandler");
const path = require("path");
const fs = require("fs");

// GET profile
exports.getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfileByUserId(req.user._id);

  if (!profile) {
    const error = new Error("Profile not found");
    error.statusCode = 404;
    throw error;
  }

  return response.success(res, "Profile fetched successfully", profile);
});

// UPDATE (Upsert) profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const profileData = { ...req.body };

  // Parse JSON strings for address and socialLinks if provided in multipart form
  if (typeof profileData.address === "string") {
    try {
      profileData.address = JSON.parse(profileData.address);
    } catch (error) {
      // Keep as string or handle error if needed
    }
  }

  if (typeof profileData.socialLinks === "string") {
    try {
      profileData.socialLinks = JSON.parse(profileData.socialLinks);
    } catch (error) {
      // Keep as string or handle error if needed
    }
  }

  // If a file was uploaded, build its public URL and set as avatar
  if (req.file) {
    profileData.avatar = `${req.protocol}://${req.get("host")}/uploads/profiles/${req.file.filename}`;
  }

  const profile = await profileService.upsertProfile(req.user._id, profileData);

  return response.success(res, "Profile updated successfully", profile);
});

