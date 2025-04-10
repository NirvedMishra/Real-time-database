import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { sendMail } from "../utils/sendMail.js";

const register = asynchandler(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        throw new ApiError(400, "Email and password are required")
    }
    const existed = await User.findOne({email});
    if(existed){
        throw new ApiError(400, "User already exists")
    }
    const otp = Math.floor(Math.random() * 1000000);
    const user = await User.create({email, password,otp});
    try {
        console.log("sending email")
        await sendMail(user.email,`User Verification`,`<h1>Otp: ${otp}</h1>`);
    } catch (error) {
        await User.findByIdAndDelete(user._id);
        throw new ApiError(500,error.message);
    }
    return res.json(
        new ApiResponse(200,{},"Otp sent check your email"));

});
const verifyUser = asynchandler(async (req, res) => {
    const{email,otp} = req.body;
    if(!email || !otp){
        throw new ApiError(400, "Email and otp are required")
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400, "User not found")
    }
    const isMatch = await user.checkOtp(otp);
    if(!isMatch){
        throw new ApiError(400, "Invalid otp")
    }
    user.isVerified = true;
    user.otp = '';
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken},"Verified successfully"));

});
const login = asynchandler(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        throw new ApiError(400, "Email and password are required")
    }
    const user = await User.findOne({email}); 
    if(!user){
        throw new ApiError(400, "User not found")
    }
    if(user.isVerified === false){
        throw new ApiError(400, "User not verified")
    }
    const isMatch = await user.checkPassword(password);
    if(!isMatch){
        throw new ApiError(400, "Invalid password")
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken},"User logged in successfully"));
})

const logout = asynchandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(400, "User not found")
    }
    user.refreshToken = "";
    await user.save();
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken",null,options).cookie("refreshToken",null,options).json(new ApiResponse(200,{},"User logged out successfully"));
});

export {register, verifyUser, login, logout}