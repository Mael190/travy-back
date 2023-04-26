const jwt = require('jsonwebtoken');
const config = require("./config/auth.config.js");

module.exports = io => {
    
    io.use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
          jwt.verify(socket.handshake.query.token, config.secret, function(err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
          });
        }
        else {
          next(new Error('Authentication error'));
        }    
      })
    
    io.on('connection', (socket) => {
        console.log('a user connected');
    });
}