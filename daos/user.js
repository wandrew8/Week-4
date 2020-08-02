const User = require('../models/user');
const Token = require('../models/token');
module.exports = {};

module.exports.findAll = () => {
    return User.find({});
}

//Import bcrypt and hash password before entering into database
module.exports.signupUser = (email, password) => {
    return User.create({
        email,
        password,
    })
}

module.exports.findOne = (email) => {
    return User.findOne({ email }).lean();
}

module.exports.findOneToken = (userId) => {
    return Token.findOne({ userId }).lean();
}

module.exports.findOneTokenByTokenString = (token) => {
    return Token.findOne({ token: token }).lean();
}

module.exports.addUserToken = (userId, token) => {
    return Token.create({
        userId,
        token
    });
    
}

module.exports.logoutUser = (token) => {
    return Token.deleteOne({ token: token });
}

module.exports.changePassword = (userId, password) => {
    return User.updateOne({ _id: userId }, {$set: {password: password}});
}