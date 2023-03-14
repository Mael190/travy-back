const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

exports.verifyToken = (req, res, next) => {
  if(req.path === '/api/auth/signin') {
    return next();
  }
  const token = req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).send({
      message: "Pas de token"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Token invalide"
      });
    }
    req.userId = decoded.userId;
    req.organisations = decoded.organisations;
    next();
  });
};