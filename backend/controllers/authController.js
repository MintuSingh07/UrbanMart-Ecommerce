const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const generateToken = require('../middlewares/generateToken');
const upload = require('../middlewares/upload');

const RegisterController = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        } else {
            const { userName, email, password } = req.body;
            const profilePicture = req.file ? req.file.filename : null;

            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) return res.status(400).json({ message: 'User already exists' });

                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const newUser = new User({
                    userName,
                    email,
                    password: hashedPassword,
                    profilePicture
                });

                await newUser.save();

                const token = generateToken(newUser);

                res.status(201).json({ message: 'User registered successfully', token, user: newUser });
            } catch (error) {
                res.status(500).json({ message: 'Error registering user', error });
            }
        }
    });
};

const LoginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

module.exports = {
    LoginController,
    RegisterController
};
