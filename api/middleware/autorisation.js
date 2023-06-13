const jwt = require('jsonwebtoken');

// Middleware pour identifier le token
const autorisation = (req, res, next) => {
    // Récupérer le token dans le header
    const token = req.headers.authorization;
    // Vérifier que le token est présent
    if (token) {
        // Vérifier que le token est valide
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send({ message: "Token invalide" });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).send({ message: "Token requis" });
    }
};

module.exports = autorisation;