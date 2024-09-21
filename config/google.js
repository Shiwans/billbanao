// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mongoose = require('mongoose');
// const User = require('../Model/User');

// module.exports = function(passport) {
//     passport.use(new GoogleStrategy({
//         clientID: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         callbackURL: '/auth/google/callback'
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         const newUser = {
//             googleId: profile.id,
//             email: profile.emails?.[0]?.value || '', // Safely access email
//             displayName: profile.displayName || '', // Safely access display name
//             // Additional fields can be added here
//         };
        

//         try {
//             let user = await User.findOne({ googleId: profile.id });
//             if (user) {
//                 return done(null, user);
//             } else {
//                 user = await User.create(newUser);
//                 return done(null, user);
//             }
//         } catch (err) {
//             console.error(err);
//             return done(err); // Pass the error to done
//         }
//     }));

//     // Serializing and deserializing of user
//     passport.serializeUser((user, done) => {
//         done(null, user.id); // Serialize the user ID
//     });

//     passport.deserializeUser(async (id, done) => {
//         try {
//             const user = await User.findById(id);
//             done(null, user);
//         } catch (err) {
//             done(err);
//         }
//     });
// };
