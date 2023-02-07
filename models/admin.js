import mongoose from "mongoose";
import bcrypt from "bcrypt";
const adminSchema = new mongoose.Schema({
  emailid: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});
adminSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.log(err);
  }
});
export const Admin = mongoose.model("admin", adminSchema);
