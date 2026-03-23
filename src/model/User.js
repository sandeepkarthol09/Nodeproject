const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      index: true,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      validate: {
        validator: async function (value) {
          const user = await mongoose.models.User.findOne({ email: value });
          if (!user) return true; // email does not exist anywhere
          return user._id.equals(this._id); // allow if it's the same user
        },
        message: "Email already exists",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other",
      },
    },
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    passwordResetToken: {
      type: String,
      select: false, // Don't return this by default
    },
    passwordResetExpires: {
      type: Date,
      select: false, // Don't return this by default
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// 🔗 Link to Profile model
userSchema.virtual("profile", {
  ref: "Profile",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

// 🔒 Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ✅ Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
