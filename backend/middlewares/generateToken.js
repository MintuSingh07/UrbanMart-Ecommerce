const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user._id,
        userName: user.userName,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
};

module.exports = generateToken;
