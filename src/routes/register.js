const express = require('express')
const router = express.Router();
const db = require('../models/models')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const dotenv = require('dotenv').config();
const user = db.user;

const transporter = nodemailer.createTransport(
    {
      host: 'smtp.gmail.com',
      port: '465',
        auth: {
            user: 'samuelechols223@gmail.com',
            pass: 'tymntesyskcxceic',
        }
    }
)

transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Server is ready to send mail!")
    }
})

router.post('/register', (req,res) =>  {
    user.findOne(
        {
        $or: [{email: req.body.email.toLowerCase()}, 
              {username: req.body.username.toLowerCase }]
        },
        (err, existingUser) => {
            if (existingUser) {
                return res.status(400).json({
                    messsage: "Username already in use!",
                });
            } else {
                const email = req.body.email.toLowerCase();
                const password = req.body.password;
                const username = req.body.username.toLowerCase();

                var activationToken = jwt.sign(
                    { email, password, username },
                    process.env.JWT_TOKEN,
                    {expiresIn: "10m"},
                );
                let mailOptions = {}
            if (process.env.NODE_ENV == 'development') {

                let mailOptions = {
                    from: 'SEAuth',
                    to: req.body.email.toLowerCase(),
                    subject: 'Email Confirmation',
                    html: `<h2>Here's your confirmation link</h2>
                            <a href="http://localhost:3000/activation?activate=${activationToken}"http://localhost:3000/activation?activate=${activationToken}</a>
                            <p>Thank you for creating an account with SEAuth! For security reason, this will expire in 10 minutes.</p>
                            `
                }
                let mail =  transporter.sendMail(mailOptions,(err,result) => {
                    res.status(200).send({
                        message: `Activation Email Successfully sent to ${email} (will expire in 10 minutes) with ${activationToken}`
                    })
                }
                )
            } else {
                let mailOptions = {
                    from: 'SEAuth',
                    to: req.body.email.toLowerCase(),
                    subject: 'Email Confirmation',
                    html: `<h2>Here's your confirmation link</h2>
                            <a href="https://seauth.herokuapp.com/activation?activate=${activationToken}"https://seauth.herokuapp.com/activation?activate=${activationToken}</a>
                            <p>Thank you for creating an account with SEAuth! For security reason, this will expire in 10 minutes.</p>
                            `
                }
                let mail =  transporter.sendMail(mailOptions,(err,result) => {
                    res.status(200).send({
                        message: `Activation Email Successfully sent to ${email} (will expire in 10 minutes) with ${activationToken}`
                    })
                }
                )

            }   
            }
        }
        )
})

router.post('/activation', (req,res) => {
    const activationToken = req.body.activationToken;
    if (activationToken) {
        jwt.verify(activationToken, process.env.JWT_TOKEN3, (err, token) => {
           if (err) {
               return res.status(400).json({
                   message: "Activation link expired!"
               })
           } else {
               if (existingUser.username == username) {
                   return res.status(400).json({
                       message: "Username already in use!"
                   })
               } else  if (existingUser.email == email) {
                   return res.status(400).json({
                       message: "Email already in use!"
                   })
               } else {
                   const user = db.user({
                       email,
                       username,
                       password
                   });
                   user.save((err, document) => {
                       if (err) {
                           return res.status(400).json({
                               messag: "Verification unsuccessful"
                           })
                       } else {
                           res.status(200).json({
                               message: "Account activation successful! Continue to login",
                               registeredUser: {
                                   id: document._id,
                                   name: document.username,
                                   email: document.email,
                               }
                           })
                       }
                   })
               }
           }
    
        })
    }
})

module.exports = router;