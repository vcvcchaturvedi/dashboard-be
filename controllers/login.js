import { Customer } from "../models/customer.js";
import { Admin } from "../models/admin.js";
import bcrypt from "bcrypt";
const checkLogin = async (emailid, password) => {
  try {
    const user = await Admin.findOne({ emailid });
    if (user) {
      const userPassword = user.password;
      const result = await bcrypt.compare(password, userPassword);
      if (result) {
        return { username: emailid, role: "admin" };
      }
      return { message: "Invalid password." };
    }
    const customer = await Customer.findOne({ emailid });
    if (customer) {
      const customerPassword = customer.password;
      const checkPassword = await bcrypt.compare(password, customerPassword);
      if (checkPassword) {
        return { username: emailid, role: "customer" };
      }
      return { message: "Invalid password." };
    }
  } catch (err) {
    console.log(err);
    return { message: "Error in server." };
  }
};
const userExists = async (emailid, role) => {
  try {
    if (role === "admin") {
      const user = await Admin.findOne({ emailid });
      if (user) return true;
    } else {
      const user = await Customer.findOne({ emailid });
      if (user) return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};
export default { checkLogin, userExists };
