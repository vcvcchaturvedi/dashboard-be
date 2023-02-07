import { Customer } from "../models/customer.js";
const addCustomer = async (customer) => {
  try {
    const newCustomer = new Customer(customer);
    newCustomer.save();
    return true;
  } catch (err) {
    return false;
  }
};
const updateCustomer = async (emailid, customer) => {
  try {
    await Customer.findOneAndUpdate({ emailid }, customer);
    return true;
  } catch (err) {
    return null;
  }
};
const getCustomer = async (emailid) => {
  try {
    return await Customer.findOne({ emailid });
  } catch (err) {
    return null;
  }
};
const getAllCustomers = async () => {
  try {
    return await Customer.find({});
  } catch (err) {
    return null;
  }
};
const deleteCustomer = async (emailid) => {
  try {
    const result = await Customer.findOneAndDelete({ emailid });
    if (result) return true;
  } catch (err) {}

  return false;
};
const activateDeactivateCustomer = async (emailid, activate) => {
  try {
    const updatedCustomer = await Customer.findOneAndUpdate(
      { emailid },
      { active: activate }
    );
    if (updatedCustomer) return true;
  } catch (err) {}
  return false;
};
export default {
  addCustomer,
  updateCustomer,
  getCustomer,
  getAllCustomers,
  deleteCustomer,
  activateDeactivateCustomer,
};
