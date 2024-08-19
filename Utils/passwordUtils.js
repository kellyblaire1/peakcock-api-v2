const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 12; // Securely handle the salt rounds
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };
