const User = require('../models/user');
const bcrypt = require('bcrypt');
module.exports = {};

//Import bcrypt and hash password before entering into database
module.exports.signupUser = (email, password) => {
    return User.create({
        email,
        password
    })
}