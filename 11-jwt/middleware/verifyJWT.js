const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });
    console.log("Brear::",authHeader); // Brear token
    const token = authHeader && authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
             (err ,decoded)=>{
                if(err)  return res.sendStatus(403); // invalid token
                console.log("decoded::",decoded); // decoded token
                req.user = decoded.username;
                next();
             });
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
}

module.exports = verifyJWT;