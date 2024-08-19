import express from "express";
import { updateUser, deleteUser, getAllUser, getSingleUser, getUserProfile, getMyAppointments } from "../Controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/",authenticate, getAllUser);
router.get("/:id",authenticate, getSingleUser);

router.put("/:id",authenticate, updateUser);
router.delete("/:id",authenticate,deleteUser);
router.get("/profile/me",getUserProfile);
router.get("/appointments/my-appointments",authenticate,getMyAppointments);

export default router;
