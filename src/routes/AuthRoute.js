import { Router } from "express";
import { login, register, logout } from "../controllers/AuthController.js";

const route = Router();

route.post("/register", register);
route.post("/login", login);
route.post("/logout", logout);

// Route test
route.get("/test", (req, res) => {
  res.send("Auth route is working!");
});

export default route;