const User = require('../models/userModel');
const generateToken = require('../helper/generateToken.js');

exports.register = async (req, res) => {
    try {
        console.log("================================>", req.body);
        const { name, email, password, pic } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please Enter all the Feilds");
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }

        const user = await User.create({
            name,
            email,
            password,
            pic,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error in Register API:", error.message);

        // Handle unexpected errors
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.allUsers = async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};

        // Combined the two `find()` calls into one
        const users = await User.find({
            ...keyword,
            _id: { $ne: req.user._id }, // Exclude the logged-in user
        });
        console.log('users>>>>>>>>>>>>>>>>', users);
        res.send(users);
    } catch (error) {
        console.log('error<<<<<allUsers', error);
        res.status(500).json({ error: error.message });
    }
};

exports.functionName = async (req, res) => {
    try {
        // Your code here
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};