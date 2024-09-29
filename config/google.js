// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../Model/User');

// module.exports = function(passport) {
//     passport.use(new GoogleStrategy({
//         clientID: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         callbackURL: '/auth/google/callback',
//         passReqToCallback: true // Allows us to pass request to callback
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//         try {
//             // Check if the user exists in the database
//             let user = await User.findOne({ googleId: profile.id });
//             if (user) {
//                 // User already exists, update access token if necessary
//                 return done(null, user);
//             }

//             // If the user doesn't exist, create a new user
//             user = new User({
//                 googleId: profile.id,
//                 email: profile.emails?.[0]?.value || '', // Safely handle no email
//                 displayName: profile.displayName || '', // Safely handle no name
//             });

//             await user.save();
//             return done(null, user);
//         } catch (err) {
//             console.error(err);
//             return done(err, false);
//         }
//     }));

//     // Serialize the user into the session
//     passport.serializeUser((user, done) => {
//         done(null, user.id); // Serialize user by their ID
//     });

//     // Deserialize the user from the session
//     passport.deserializeUser(async (id, done) => {
//         try {
//             const user = await User.findById(id);
//             done(null, user);
//         } catch (err) {
//             console.error(err);
//             done(err, false);
//         }
//     });
// };
