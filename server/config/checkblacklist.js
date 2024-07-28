const { invalidatedTokens } = require("./rabbitMq");

module.exports.checkBlacklist = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (invalidatedTokens.has(token)) {
        return res.status(401).json({
            message: "Token is invalidated"
        });
    } else {
        next();
    }
};