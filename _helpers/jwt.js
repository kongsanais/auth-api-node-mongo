const expressJwt = require('express-jwt');
const config = require('config.json');
const controllerUser = require('../controller/c_user');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked })
    .unless({
        path: [
            /* public routes (not auth can access)*/
            '/users/login',
            '/users/register',
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await controllerUser.getUserById(payload.sub);
    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }
    done();
};