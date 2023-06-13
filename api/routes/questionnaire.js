const router = require('express').Router();
const autorisation = require('../middleware/autorisation');

router.get('/', autorisation, (_, res) => {
    res.status(200).send(require('../data.json').questions);
});

module.exports = router;