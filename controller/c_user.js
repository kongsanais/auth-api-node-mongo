const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getUserById,
};


async function registerUser(userParam) {
    // validate ss
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}


async function loginUser({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '1d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}


async function updateUser(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) 
    {
        throw 'Username "' + userParam.username + '" is already';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
    return user;
}

async function deleteUser(id) {
    await User.findByIdAndRemove(id);
}

async function getAllUser() {
    return await User.find();
}

async function getUserById(id) {
    return await User.findById(id);
}

