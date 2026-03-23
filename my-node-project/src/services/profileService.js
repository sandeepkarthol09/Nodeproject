const Profile = require("../model/Profile");

exports.getProfileByUserId = async (userId) => {
  return await Profile.findOne({ userId }).populate("userId", "name email phone gender roleId");
};

exports.upsertProfile = async (userId, profileData) => {
  // If the profile exists, update it, otherwise create a new one
  return await Profile.findOneAndUpdate(
    { userId },
    { ...profileData, userId },
    { new: true, upsert: true, runValidators: true }
  );
};
