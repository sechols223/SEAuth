const express = require('express')
const db = require('../models/models')
const user = db.user;

let authenticateToken = (req,res, next) => {
    const token = req.cookies.x_auth;

    user.findByToken(token, (err,user) => {
        if (err) {
            return res.status(400).send({auth:false, message: "Unable to authenticate, please try again later"})
        }

        req.token = token;
        req.user = user;
        next();
    });
};

module.exports = {authenticateToken}