import express from "express";
import passport from "passport";
import "./passport.js";
import authRouter from "./routes/auth.js";
import Admin from "./routes/admin.js";
import customerRouter from "./routes/customer.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
const { router: adminRouter } = Admin;
dotenv.config();
const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;
con.on("open", function () {
  console.log("Mongo DB connected");
});
const app = express();
const adminOnly = (req, res, next) => {
  const user = req.user;
  if (user.role === "admin") {
    next();
  } else res.status(401).send({ message: "Unauthorized" });
};
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRouter);
app.use(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  adminOnly,
  adminRouter
);
app.use(
  "/customers",
  passport.authenticate("jwt", { session: false }),
  customerRouter
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
