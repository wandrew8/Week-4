const Note = require('../models/note');
const Token = require('../models/token');
const User = require('../models/user');
module.exports = {};


module.exports.findToken = (token) => {
    return Token.findOne({ token: token }).lean();
}

module.exports.findUser = (userId) => {
    return User.findOne({ _id: userId }).lean();;
}

module.exports.addNote = (text, userId) => {
    return Note.create({ text: text, userId: userId });
}

module.exports.getNotes = (userId) => {
    return Note.find({ userId: userId }).lean();
}

module.exports.getSingleNote = (noteId) => {
    return Note.findOne({ _id: noteId }).lean();
}
