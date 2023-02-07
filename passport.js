import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import passportJWT from "passport-jwt";
import LoginController from "./controllers/login.js";
import dotenv from "dotenv";
const { checkLogin, userExists } = LoginController;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken;
dotenv.config();
passport.use(
  new LocalStrategy(async (username, password, done) => {
    let checkUser = await checkLogin(username, password);
    if (checkUser.username)
      done(null, checkUser, { message: "Logged in successfully" });
    else done(null, false, { message: "Incorrect username or password" });
  })
);
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT(),
      secretOrKey: process.env.JWT_KEY,
    },
    async function (jwtPayload, cb) {
      let check = await userExists(jwtPayload.username, jwtPayload.role);
      if (check)
        cb(null, { username: jwtPayload.username, role: jwtPayload.role });
      else cb(new Error("Not a valid token"));
    }
  )
);
