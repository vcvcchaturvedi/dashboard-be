import mongoose from "mongoose";
import bcrypt from "bcrypt";
const customerSchema = new mongoose.Schema({
  emailid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: "true",
  },
  phoneno: {
    type: Number,
    maxLength: 10,
  },
  password: {
    type: String,
  },
  profilePic: {
    data: Buffer,
    contentType: "String",
  },
  active: {
    type: Boolean,
    default: true,
  },
});
customerSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.log(err);
  }
});
export const Customer = mongoose.model("customer", customerSchema);
