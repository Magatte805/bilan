const router = require('express').Router();
const jwt = require('jsonwebtoken');

// Route pour obtenir un user en fonction du token
router.get('/', (req, res) => { 
    const token = req.headers.authorization;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).send(payload);
    } catch (err) {
        return res.status(401).send({ message: "Token invalide" });
    }
});

module.exports = router;
