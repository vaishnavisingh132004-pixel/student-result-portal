
const jwt = require("jsonwebtoken");

function protect(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    try {
        const token = header.split(" ")[1];

        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access only"
        });
    }

    next();
}

function studentOnly(req, res, next) {
    if (!req.user || req.user.role !== "student") {
        return res.status(403).json({
            message: "Student access only"
        });
    }

    next();
}

module.exports = {
    protect,
    adminOnly,
    studentOnly
};
