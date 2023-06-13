const router = require('express').Router();
const autorisation = require('../middleware/autorisation');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { calculateCarbonFootprint } = require('../index');

// Route pour récupérer les informations du profil
// Cela comprend les résultats des tests
router.get("/", autorisation, async (req, res) => {
    const username = req.user.username;
    const user = await db.get(`users.${username}`);
    if (!user) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }
    delete user.password;
    const resultats = await db.get(`resultats`);
    for (const [id, resultat] of Object.entries(resultats)) {
        if (resultat.user !== username) {
            delete resultats[id];
        } else {
            resultats[id] = calculateCarbonFootprint(resultat.responses);
        }
    }
    res.status(200).json({ username, resultats });
});

module.exports = router;