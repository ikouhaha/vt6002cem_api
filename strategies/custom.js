


const CustomStrategy = require("passport-custom").Strategy
var admin = require("firebase-admin");
const users = require('../models/users')

const checkUser = async (req, done) => {
    // look up the user and check the password if the user exists
    // call done() with either an error or the user, depending on outcome

    try {

        var token = req.headers.authorization.replace("Bearer ", "");
        var user = await admin.auth().verifyIdToken(token)
        result = await users.findByFID(user.uid)


        if (!result) {
            return done(null, { status: 401, message: "No user found", firebaseUser: user })
        }

        user = result
        //security
        delete user.password
        delete user.googleId


        return done(null, user);
    }
    catch (error) {
        console.error(`Error during authentication for user ${error}`)
        return done(null, { status: 401, message: error.message })
    }

}


const strategy = new CustomStrategy(checkUser)


module.exports = strategy