import mongoose  from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true
    },
    isTracking:{
        type:Boolean,
        default:false
    },
    dbName:{
        type:String,
    },
    dbString:{
        type:String
    },
    dbUpdates: [
        {
            operationType: {
                type: String,
                required: true,
            },
            collectionName: {
                type: String,
            },
            documentId: {
                type: String,
                required: true,
            },
            time: {
                type: String,
            },
        },
    ],
    otp:{
        type:String,
        default:""
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String,
        default:""
    },
},{timestamps:true});
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    if(this.isModified("otp")){
        this.otp = await bcrypt.hash(this.otp, 10);
    }
    next()
})
userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.checkOtp = async function(otp){
    return await bcrypt.compare(otp, this.otp)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
