import express from "express";
import {
  activateUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const useRouter = express.Router();

useRouter.post("/registration", registrationUser);
useRouter.post("/activate-user", activateUser);
useRouter.post("/login", loginUser);
useRouter.post("/social-auth", socialAuth);

useRouter.get("/logout", isAuthenticated, logoutUser);
useRouter.get("/refresh", updateAccessToken);
useRouter.get("/me", isAuthenticated, getUserInfo);
useRouter.get("/get-all-users", isAuthenticated, authorizeRoles("admin"), getAllUsers);

useRouter.put("/update-user", isAuthenticated, updateUserInfo);
useRouter.put("/update-password", isAuthenticated, updatePassword);
useRouter.put("/update-avatar", isAuthenticated, updateProfilePicture);
useRouter.put("/update-user-role", isAuthenticated, authorizeRoles("admin"), updateUserRole);

useRouter.delete("/delete-user/:id", isAuthenticated, authorizeRoles("admin"), deleteUser)

export default useRouter;
