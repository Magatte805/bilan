const router = require('express').Router();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const bcrypt = require("bcrypt");

// Route d'inscription
router.post("/", async (req, res) => {
    // Récupérer les informations de l'utilisateur
    const { username, password } = req.body;
    // Vérifier que les informations sont fournies
    if (!username || !password) {
        return res.status(400).json({ message: "Les champs username et password sont requis" });
    }
    // Si l'utilisateur existe déjà, retourner une erreur
    if ((await db.has(`users.${username}`))) {
        return res.status(409).json({ message: "L'utilisateur existe déjà" });
    }
    // Hash du mot de passe et création de l'utilisateur
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Une erreur est survenue lors de la création de l'utilisateur" });
        }
        await db.set(`users.${username}.password`, hashedPassword);
        return res.status(201).json({ message: "L'utilisateur a été créé" });
    });
})

module.exports = router;