import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const adminSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
},{timestamp: true});

adminSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

adminSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);   
}

export const Admin = mongoose.model("Admin",adminSchema)



