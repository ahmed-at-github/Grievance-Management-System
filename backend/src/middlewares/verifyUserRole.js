// verifyStudentRole
// verifyAdminRole
// verifyDeanRole
// ... extract id from accesstoken and send user {email, id, role} to this middleware as req

const authorizeRole = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

export { authorizeRole };
