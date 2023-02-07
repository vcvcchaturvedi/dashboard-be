import express from "express";
import CustomerValidation from "../validators/customer.js";
import Admin from "./admin.js";
import fs from "fs";
import CustomerController from "../controllers/customer.js";
const { updateCustomer, deleteCustomer } = CustomerController;
const { updateCustomerValidationByCustomer } = CustomerValidation;
const router = express.Router();
const { upload } = Admin;
router.put("/:id", upload.single("profilepic"), async (req, res) => {
  const emailid = req.params.id;
  const user = req.body;
  const { error } = updateCustomerValidationByCustomer.validate(user);
  if (error) {
    return res.status(400).send({
      message:
        "Please send field of customers to update in requried format only.",
    });
  }
  if (req.file) {
    const file = req.file;
    const data = fs.readFileSync(file.path);
    const contentType = file.mimetype;
    const profilePic = { data, contentType };
    user.profilePic = profilePic;
  }
  const updatedCustomer = updateCustomer(emailid, user);
  if (!updatedCustomer) {
    return res.status(500).send({ message: "Error in updating customer" });
  }

  res.send({ message: "Updated the customer" });
  if (req.file) fs.unlinkSync(req.file.path);
});
router.delete("/:id", async (req, res) => {
  const emailid = req.params.id;
  const result = await deleteCustomer(emailid);
  if (result)
    return res.send({ message: "Successfully deleted your account!" });
  res.send({ message: "Error in deleting your account." });
});
export default router;
