import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

dotenv.config({ path: "./server/.env" }); 
console.log("Resend key from env:", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);
const otpStore = {}; // Temporary storage (for production use DB)

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // expires in 5 min

  try {
    await resend.emails.send({
      from: "noreply@yourapp.com",
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP is: ${otp}</h3><p>Expires in 5 minutes.</p>`,
    });
    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    res.json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore[email];
  if (!stored) return res.json({ success: false, message: "No OTP found" });

  if (stored.expires < Date.now())
    return res.json({ success: false, message: "OTP expired" });

  if (stored.otp != otp)
    return res.json({ success: false, message: "Invalid OTP" });

  delete otpStore[email];
  res.json({ success: true, message: "OTP verified, allow password reset" });
};
















// Signup a new user
export const signup = async (req, res)=>{
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details" })
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({success: true, userData: newUser, token, message: "Account created successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to login a user
export const login = async (req, res) =>{
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({email})

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect){
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id)

        res.json({success: true, userData, token, message: "Login successful"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
// Controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

// Controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      // ✅ Ensure the image is valid Base64 or URL
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "chat_app_profiles", // Optional folder
      });

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: uploadResponse.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Cloudinary Upload Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
