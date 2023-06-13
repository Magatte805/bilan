const { QuickDB } = require("quick.db");
const db = new QuickDB();
const bcrypt = require("bcrypt");

// Middleware express pour vérifier le token
const authentification = async (req, res, next) => {
    const { username, password } = req.body;
    // Chercher l'utilisateur dans la base de données
    const user = await db.get(`users.${username}`);
    // Si l'utilisateur n'existe pas, retourner une erreur
    if (!user) {
        return res.status(400).send({ message: "Nom d'utilisateur inconnu" });
    }
    // Comparer le mot de passe fourni avec celui de la base de données
    bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
            return res.status(400).send({ message: "Mot de passe incorrect" });
        }
        // Si le mot de passe est correct, retourner l'utilisateur
        delete user.password;
        req.user = { username, ...user };
        return next();
    });
};

module.exports = authentification;