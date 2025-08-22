import express from "express";
import { checkAuth, login, signup, updateProfile, forgotPassword, verifyOtp } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-otp", verifyOtp);

export default userRouter;