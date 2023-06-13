const router = require('express').Router();
const { resultats } = require('../data.json');
const autorisation = require('../middleware/autorisation');
const { v4: uuidv4 } = require("uuid");
const { QuickDB } = require("quick.db");
const { calculateCarbonFootprint } = require('../index');
const db = new QuickDB();

router.post('/', autorisation, async (req, res) => {
    if (!req.body) {
        return res.status(400).send('Requête invalide');
    }
    const responses = req.body;
    calculateCarbonFootprint(responses, res);
    const id = uuidv4();
    await db.set(`resultats.${id}.responses`, responses);
    await db.set(`resultats.${id}.date`, new Date());
    await db.set(`resultats.${id}.user`, req.user.username);
    res.status(201).json({ id });
});

router.get('/:id', autorisation, async (req, res) => {
    const id = req.params.id;
    const responses = await db.get(`resultats.${id}.responses`);
    const total = calculateCarbonFootprint(responses, res);
    const comparaisons = {}
    for (const [objet, carbone] of Object.entries(resultats)) {
        comparaisons[objet] = total / carbone;
    }
    res.status(200).json({ comparaisons, total });
});

module.exports = router;