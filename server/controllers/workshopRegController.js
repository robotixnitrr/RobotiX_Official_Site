const asyncHandler = require("../utils/asyncHandler.js");
const Reg = require("../models/workshop/registration.workshop.js");

const createRegistration = asyncHandler( async(req, res) => {
    const {fullName, email, phone, registration_date} = req.body;
    if(
        [fullName, email, phone, registration_date].some((field) => field?.trim()==="")
    ){
        return res.status(404).json({message: "All fields are required"});
    }

    const workshop_name = req.params.id;

    const reg = await Reg.create({
        fullName,
        email,
        phone,
        workshop: workshop_name,
        registration_date
    });

    const created_reg = await Reg.findById(reg._id);
    if(!created_reg){
        return res.status(500).json({message: "Something went wrong while registration"});
    }

    return res.status(200).json({message: "Registration has been done Successfully"});
})

const getAllRegistration = asyncHandler( async(req, res) =>{
    const regs = await Reg.find();
    return res.status(200).json(regs);
})

const deleteRegistration = asyncHandler( async(req, res) => {
    const regs = await Reg.findByIdAndDelete(req.params.id);
    if(!regs){
        return res.status(404).json({ message: 'Registration not found'});
    }
    
    return res.status(200).json({message: "Registration deleted Successfully"})
})

module.exports =  {createRegistration, getAllRegistration, deleteRegistration};
