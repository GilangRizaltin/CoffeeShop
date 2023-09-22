const jwt = require("jsonwebtoken");
const {jwtKey, issuerWho} = require("../Configs/environtment")


const isLogin = (req, res, next) => {
    const bearer = req.header("Authorization")
    if(!bearer) 
        return res.status(401).json({
            msg: "Please log in first"
        });
    const token = bearer.split(" ")[1];
    jwt.verify(token, jwtKey, {issuerWho}, (error, decode) => {
        if(error)
        switch (error.name) {
            case "TokenExpiredError" :
                returnres.status(401).json({
                    msg: "Access ended, please re-log in"
                });
            case "NotBeforeError" :
                returnres.status(401).json({
                    msg: "Access hasn`t started yet. Access on time"
                })
        };
        req.userInfo = decode;
//        console.log(decode);
        next();
    });
    };

const isNormalUser = (req, res, next) => {
    const {user_name, user_type} = req.userInfo;
    if(user_type !== 'Normal User')
    return res.status(403).json({
        msg: "Access Denied"
    });
    next();
};

const isAdmin = (req, res, next) => {
    const {user_name, user_type} = req.userInfo;
    if(user_type !== 'Admin')
    return res.status(403).json({
        msg: "Access Denied"
    });
    next();
};


module.exports = {isLogin, isNormalUser, isAdmin}