const express = require('express');
const router = express.Router();
const controllerUser = require('../controller/c_user');

// routes
router.post('/register',r_registerUser);
router.post('/login', r_loginUser);
router.put('/:id', r_updateUser);
router.delete('/:id',r_deleteUser);
//get
router.get('/:id', r_getUserById);
router.get('/', r_getAllUser);

module.exports = router;

/* login user */
function r_loginUser(req, res, next) {
    controllerUser.loginUser(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

/* register user */
function r_registerUser(req, res, next) {
    controllerUser.registerUser(req.body)
        .then((user) => res.status(200).json(user))
        .catch(err => next(err));
}

/* get user list */
function r_getAllUser(req, res, next) {
    controllerUser.getAllUser()
        .then(users => res.json(users))
        .catch(err => next(err));
}

/* get user by id */
function r_getUserById(req, res, next) {
    controllerUser.getUserById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

/* update user */
function r_updateUser(req, res, next) {
    controllerUser.updateUser(req.params.id, req.body)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

/* delete user */
function r_deleteUser(req, res, next) {
    controllerUser.deleteUser(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}