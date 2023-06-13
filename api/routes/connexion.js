const router = require('express').Router();
const jwt = require('jsonwebtoken');
const authentification = require('../middleware/authentification');

// Route de connexion
router.post('/', authentification, (req, res) => {
    // Générer un token
    const token = jwt.sign({ username: req.user.username }, process.env.JWT_SECRET);
    res.status(200).json({ token });
});

module.exports = router;