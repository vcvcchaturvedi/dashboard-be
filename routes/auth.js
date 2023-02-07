import express from "express";
import passport from "passport";
import { Admin } from "../models/admin.js";
import Jwt from "jsonwebtoken";
const router = express.Router();
router.post("/registerAdmin", async (req, res) => {
  const user = req.body;
  try {
    const admin = new Admin({
      emailid: user.emailid,
      password: user.password,
    });
    const newUser = await admin.save();
    res.send(newUser);
  } catch (err) {
    res.send("Error in creating admin!");
  }
});
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user)
      return res
        .status(401)
        .send({ status: "failure", message: "Invalid credentials" });
    req.login(user, { session: false }, (err) => {
      if (err) return res.status(500).send(err);
      const token = Jwt.sign(user, process.env.JWT_KEY);
      return res.send({ user, token });
    });
  })(req, res, next);
});
export default router;
