import jwt from 'jsonwebtoken';

export function verifyAccessToken(req, res, next) {
    const authHeader = req.headers.authorization;
    // Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

export function verifyRefreshToken(req, res, next) {
    const refreshToken = req.cookies?.refreshToken; // read cookie

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        req.user = decoded; // attach decoded user info
        next();
    } catch (err) {
        // console.error(err);
        return res
            .status(403)
            .json({ message: 'Invalid or expired refresh token' });
    }
}
