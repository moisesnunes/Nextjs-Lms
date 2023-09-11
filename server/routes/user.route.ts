import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";
const useRouter = express.Router();

useRouter.post("/registration", registrationUser);
useRouter.post("/activate-user", activateUser);
useRouter.post("/login", loginUser);
useRouter.post("/social-auth", socialAuth);

useRouter.get("/logout", isAuthenticated, logoutUser);
useRouter.get("/refresh", updateAccessToken);
useRouter.get("/me", isAuthenticated, getUserInfo);

useRouter.put("/update-user", isAuthenticated, updateUserInfo);
useRouter.put("/update-password", isAuthenticated, updatePassword);
useRouter.put("/update-avatar", isAuthenticated, updateProfilePicture);

export default useRouter;
