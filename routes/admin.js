import express from "express";
import * as EmailValidator from "email-validator";
import CustomerSchema from "../validators/customer.js";
import multer from "multer";
import fs from "fs";
import CustomerController from "../controllers/customer.js";
import bcrypt from "bcrypt";
const {
  addCustomer,
  updateCustomer,
  getCustomer,
  getAllCustomers,
  deleteCustomer,
  activateDeactivateCustomer,
} = CustomerController;
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./");
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  fileFilter,
  storage,
  limits: { fileSize: 7000000 },
});
const { customerValidation, updateCustomerValidation } = CustomerSchema;
const router = express.Router();
router.post(
  "/customers/add",
  upload.single("profilepic"),
  async (req, res, next) => {
    const customer = req.body;
    const { error } = customerValidation.validate(customer);

    if (error || !EmailValidator.validate(customer.emailid)) {
      return res.send({
        message: error
          ? error
          : "Error in creating new customer, please register with valid emailid",
      });
    }
    const file = req.file;
    if (!file) {
      return res.send({
        message: "Please provide a image file to add to profile pic.",
      });
    }
    const data = fs.readFileSync(file.path);
    const contentType = file.mimetype;
    const profilePic = { data, contentType };
    customer.profilePic = profilePic;
    const resultAddCustomer = await addCustomer(customer);
    if (resultAddCustomer)
      res.send({ status: "Successfully added new customer" });
    else
      res
        .status(500)
        .send(
          "Unfortunately the customer could not be added because of some internal server error"
        );
    fs.unlinkSync(file.path);
  }
);
router.put("/customers/:id", upload.single("profilepic"), async (req, res) => {
  const user = req.body;
  const emailid = req.params.id;
  const { error } = updateCustomerValidation.validate(user);
  if (error) {
    return res.status(400).send({
      message:
        "Please send field of customers to update in requried format only.",
    });
  }
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
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

  res.send("Updated the customer");
  if (req.file) fs.unlinkSync(req.file.path);
});
router.get("/customers/:id", async (req, res) => {
  const emailid = req.params.id;
  const customer = await getCustomer(emailid);
  if (customer) return res.send(customer);
  res.send({ message: "No such customer or error in server." });
});
router.get("/customers", async (req, res) => {
  const allCustomers = await getAllCustomers();
  if (allCustomers.length) {
    return res.send(allCustomers);
  }
  res.send({ message: "No customers yet or error in server." });
});
router.delete("/customers/:id", async (req, res) => {
  const emailid = req.params.id;
  const deleteResult = await deleteCustomer(emailid);
  if (deleteResult) {
    return res.send({ message: "Successfully deleted customer" });
  }
  res.send("Error in deleting customer");
});
router.get("/customers/activate/:id", async (req, res) => {
  const emailid = req.params.id;
  const result = await activateDeactivateCustomer(emailid, true);
  if (result) return res.send({ message: "Successfully activated customer" });
  res.send({ message: "Error in activating customer" });
});
router.get("/customers/deactivate/:id", async (req, res) => {
  const emailid = req.params.id;
  const result = await activateDeactivateCustomer(emailid, false);
  if (result) return res.send({ message: "Successfully deactivated customer" });
  res.send({ message: "Error in activating customer" });
});
export default { router, upload };
