const express = require('express')
const router = express.Router();
const {authenticateToken} = require('../middleware/auth.middleware')


router.get('/auth', authenticateToken, (req,res) => {
    res.status(200).json(
        {
            userData: {
                id:req.user._id,
                username: req.user.username,
                email:req.user.email,
            }
        }
    )
})

module.exports = router;