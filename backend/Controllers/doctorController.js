import BookingSchema from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedDoctor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Successfully Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id).populate("reviews").select("_password");
    res.status(200).json({ success: true, message: "Doctor found", data: doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch doctor" });
  }
};

export const getAllDoctor = async (req, res) => {
  try {

const {query} =req.query ;  
let doctors;
if(query){
    doctors=await Doctor.find({isApproved:"approved",$or:[{name:{regex:query,$options:'i'}},
    {specialization:{regex:query,$options:'i'}}]})
}
else{
     doctors = await Doctor.find({isApproved:"approved"});
}

    res.status(200).json({ success: true, message: "Doctors found", data: doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch doctors" });
  }
};

export const getDoctorProfile = async (req,res)=>{
  const userId = req.userId

  try {
    const doctor = await Doctor.findById(userId)

    if(!doctor){
      return res.status(404).json({success:false,message:"Doctor not found"})
    }

    const {password, ...rest} = doctor._doc;
    const appointments = await Booking.find({doctor:doctor})

    res.status(200).json({success:true,message:"profile info is getting",data:{...rest,appointments}})
  } catch (error) {
    res.status(500).json({success:false,message:"something went wrong,cannot get" });
  }
};