const passport = require("passport");
const {Strategy, ExtractJwt} = require("passport-jwt");
const Admin = require("../model/admin");

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}

passport.use(new Strategy(opts, async (jwt_payload, done)=>{
    try {
        const user = await Admin.findById(jwt_payload._id);
        if(user){
            return done(null, user)
        }
        return done(null, false)
    } catch (error) {
        return done(error,false)
    }
}));

module.exports = passport;