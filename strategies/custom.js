


const CustomStrategy = require("passport-custom").Strategy
var admin = require("firebase-admin");
const users = require('../models/users')

const checkUser = async (req, done) => {
    // look up the user and check the password if the user exists
    // call done() with either an error or the user, depending on outcome
    
    let result
    try {
        var token = req.headers.authorization.split(" ")[1];
        var user = await admin.auth().verifyIdToken(token)

        result = await users.findByUsername(jwt_payload.username)
    } catch (error) {
        console.error(`Error during jwt authentication for user ${username}`)
        return done(error)
    }
    if (result.length) {
        const user = result[0]
        //security
        delete user.password
        //delete user.googleId
        return done(null, user)
    } else {
        //console.log(`No user found with username `)
    }

    return done(null, false) // token expired?
}


const strategy = new CustomStrategy(checkUser)


module.exports = strategy