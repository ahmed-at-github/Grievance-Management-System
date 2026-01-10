import bcrypt from 'bcrypt';

// hash password

async function hashPassword(password) {
    const hashPass = await bcrypt.hash(password, 10);
    return hashPass;
}

// compare password
async function comparePassword(inputPass, hashPass) {
    const match = await bcrypt.compare(inputPass, hashPass);
    return match;
}
// await bcrypt.compare(pwd, foundUser.password);

export { hashPassword, comparePassword };
