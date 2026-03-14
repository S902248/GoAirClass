const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');

// Generate a random 6-digit OTP
const generate6DigitOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * sendOtp / getOtp
 * Generates and saves OTP for a mobile number.
 * Works for both new and existing users.
 */
const getOtp = async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
            return res.status(400).json({ success: false, message: "Valid 10-digit mobile number is required" });
        }

        const otp = generate6DigitOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Find or Create user to ensure only one record per phone number
        let user = await User.findOne({ mobileNumber });
        if (!user) {
            user = new User({
                fullName: "Guest User",
                mobileNumber,
                role: "user"
            });
        }

        // Overwrite previous OTP and update expiry
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Debugging logs
        console.log("------------------------------------");
        console.log(`>>> OTP GENERATED: ${otp} for ${mobileNumber} <<<`);
        console.log(`>>> EXPIRY: ${otpExpiry.toISOString()} <<<`);
        console.log("------------------------------------");

        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("sendOtp error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * resendOtp
 * Overwrites the previous OTP and resets expiry.
 */
const resendOtp = async (req, res) => {
    console.log("Resending OTP...");
    return getOtp(req, res); // Reuse sendOtp logic as it already overwrites
};

/**
 * verifyOtp
 * Verifies the latest OTP, handles expiry, and clears it after success.
 */
const verifyOtp = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;

        if (!mobileNumber || !otp) {
            return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
        }

        const user = await User.findOne({ mobileNumber });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please request a new OTP." });
        }

        // 1. Check if OTP exists
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ success: false, message: "No OTP found. Please request a new OTP." });
        }

        // 2. Add console logs for debugging OTP mismatch
        console.log(`[DEBUG] Verifying OTP for ${mobileNumber}. Provided: ${otp}, Stored: ${user.otp}`);

        // 3. Check if OTP is expired
        if (new Date() > user.otpExpiry) {
            // Clear expired OTP
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        // 4. Check OTP match
        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // 5. OTP is correct - Clear it after successful verification
        user.otp = null;
        user.otpExpiry = null;

        // Check if this is the super admin from .env
        const isSuperAdmin = mobileNumber === process.env.ADMIN_MOBILE;
        if (isSuperAdmin && user.role !== "superadmin") {
            user.role = "superadmin";
            if (user.fullName === "Guest User") {
                user.fullName = process.env.ADMIN_NAME || "Super Admin";
            }
        }

        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: "30d" }
        );

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                mobileNumber: user.mobileNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.error("verifyOtp error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Aliases for backward compatibility if needed, or we just update routes
const loginWithOtp = getOtp;
const verifyLoginOtp = verifyOtp;

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();

        // Placeholders for other stats (to be implemented with real models later)
        res.status(200).json({
            success: true,
            stats: {
                revenue: 1254300, // Placeholder
                bookings: 8540,   // Placeholder
                users: userCount,
                agents: 450       // Placeholder
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Submit Admin Access Request
const submitAdminRequest = async (req, res) => {
    try {
        const { fullName, mobileNumber, email, username, password } = req.body;

        // Find user by mobile to get their ID
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if a pending request already exists for this username
        const existingRequest = await AdminRequest.findOne({ username, status: 'pending' });
        if (existingRequest) {
            return res.status(400).json({ success: false, message: "A request with this username is already pending" });
        }

        // Hash the admin password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newRequest = await AdminRequest.create({
            userId: user._id,
            fullName,
            mobileNumber,
            email,
            username,
            password: hashedPassword,
            status: 'pending',
            requestedRole: 'admin'
        });

        res.status(201).json({
            success: true,
            message: "Request submitted successfully",
            request: newRequest
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get all Admin Requests (Super Admin only)
const getAdminRequests = async (req, res) => {
    try {
        const requests = await AdminRequest.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get Admin Notifications (pending requests count)
const getAdminNotifications = async (req, res) => {
    try {
        const count = await AdminRequest.countDocuments({ status: 'pending' });
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update Admin Request Status (Approve/Reject)
const updateAdminRequestStatus = async (req, res) => {
    try {
        const { requestId, status, permissions } = req.body;

        const request = await AdminRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        request.status = status;
        if (status === 'approved') {
            request.permissions = permissions;

            // Update the User document
            const user = await User.findById(request.userId);
            if (user) {
                user.role = 'admin';
                // Store the admin username and password from the request
                // In a real app we might want a separate profile or field
                user.adminUsername = request.username;
                user.adminPassword = request.password; // This is already hashed
                user.permissions = permissions;
                await user.save();
            }
        }

        await request.save();
        res.status(200).json({ success: true, message: `Request ${status} successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Admin Login (Username/Password)
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ adminUsername: username });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.adminPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                mobile: user.mobileNumber,
                role: user.role,
                permissions: user.permissions
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get all Admins (Super Admin only)
const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password -adminPassword');
        res.status(200).json({ success: true, admins });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getOtp,
    resendOtp,
    verifyOtp,
    loginWithOtp,
    verifyLoginOtp,
    getDashboardStats,
    submitAdminRequest,
    getAdminRequests,
    getAdminNotifications,
    updateAdminRequestStatus,
    adminLogin,
    getAllAdmins
};
