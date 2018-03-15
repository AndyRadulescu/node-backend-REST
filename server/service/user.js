"user strict"

const jwt = require('jsonwebtoken');
const jwtPrivateKey = "cefvvaesjbdsafdas";
const user = require('../models').user;
const moment = require('moment');
const notFound = "User Not In The Database";

/**
 *Recives the token from a header from the frontend, and verifies it.
 * @param {*} req 
 * @param {*} res 
 */
exports.authToken = (req, res) => {
    let token = req.headers.authorization;
    if (token) {
        try {
            let decoded = jwt.verify(token, jwtPrivateKey);
        } catch (err) {
            // console.log(err);
            console.log('malformed');
            res.status(401).send({
                message: 'UnAuthorized'
            });
            return;
        }
        console.log(decoded);
        user.findOne({
            where: { id: decoded.id }
            , include: [{ all: true }]
        }).then(user => {
            let date = new Date(decoded.updateDate);
            if (user.updatedAt.getTime() === date.getTime()) {

                res.status(200).send({
                    // token:
                    message: 'Authorized'
                });
            } else {
                throw 'token not up to date';
            }
        }).catch(error => {
            console.log(error);
            res.status(401).send({
                message: 'UnAuthorized'
            });
        });
    } else {
        res.status(401).send({
            message: 'UnAuthorized'
        });
    }
    //to do the response
};

/**
 * Gets a user by its ID.
 * @param {*} req 
 * @param {*} res 
 */
exports.getUser = (req, res) => {
    user.findById(req.params.id, {
        include: [{ all: true }]
    }).then(user => {
        if (!user) {
            return res.status(204).send({
                message: notFound
            });
        }
        res.status(200).send(user);
    }).catch(error => res.status(400).send(error));
};

function expireDate() {
    return Math.floor
}

/**
 * Called on login.
 * @param {*} req 
 * @param {*} res 
 */
exports.login = (req, res) => {
    console.log(req.body);
    user.findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        }, include: [{ all: true }]
    }).then(user => {
        if (!user) {
            return res.status(204).send({
                message: notFound
            });
        }
        tokenString = jwt.sign({
            id: user.id,
            email: user.email,
            updateDate: user.updatedAt,
            expiresInMinutes: 1440 * 30
        }, jwtPrivateKey);
        res.status(200).send({
            token: tokenString
        });
    }).catch(error => res.status(400).send(error));
};

/**
 * Insert a new user into the database.
 * @param {*} req 
 * @param {*} res 
 */
exports.insertUser = (req, res) => {
    console.log(req.body);
    res.jsonp(user.create(req.body));
};

/**
 * Updates a user. It finds the user by its ID.
 * @param {*} req 
 * @param {*} res 
 */
exports.updateUser = (req, res) => {
    let id = req.params.id;
    console.log(id);
    user.findById(id)
        .then(user => {
            if (!user) {
                return res.status(400).send({
                    message: notFound
                });
            }
            user.update(req.body, {
                where:
                    { id: id }
            }).then(() => res.status(200).send({
                message: 'User updated'
            })).catch(error => res.status(400).send(error));
        }).catch(error => res.status(400).send(error));
};

/**
 * Deletes a user by it's name.
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = (req, res) => {
    let id = req.params.id;
    user.findById(id).then(user => {
        if (!user) {
            return res.status(400).send({
                message: notFound
            });
        }
        return user.destroy().then(() => res.status(204).send({
            message: 'User deleted successfully'
        })).catch(error => res.status(400).send(error));
    }).catch(error => res.status(400).send(error));
};