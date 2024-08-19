import { updateDoctor,deleteDoctor,getAllDoctor,getSingleDoctor, getDoctorProfile } from "../Controllers/doctorController.js";
import express from "express"
import { authenticate } from "../auth/verifyToken.js";

import reviewRouter from './review.js'

 const router =express.Router();

 router.use('/:doctorId/reviews',reviewRouter)

 router.get("/:id",getSingleDoctor);
 router.get("/",getAllDoctor);
 router.put("/:id",authenticate,updateDoctor);
 router.delete("/:id",authenticate,deleteDoctor);

 router.get('/profile/me',authenticate,getDoctorProfile);

 export default router;