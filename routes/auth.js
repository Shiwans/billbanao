// const express = require('express');
// const router = express.Router();
// const passport = require('passport')
// const jwt = require('jsonwebtoken');


// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login?auth=failed' }), (req, res) => {
//     const token = jwt.sign({ userId: req.user.googleId }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.redirect(`http://localhost:3000/?token=${token}&user=${JSON.stringify(req.user)}`); // Optional: Send user info
// });


// router.post('/logout', (req, res) => {
//     res.status(200).json({ message: "Logged out" });

// });

// router.get('/login/success',async (req, res) => { 
//     if(req.user){
//         res.status(200).json({message:"user logined in",user:req.user})

//     }else{
//         res.status(400).json({message:"Not authorized"})
//     }

// });
// module.exports = router