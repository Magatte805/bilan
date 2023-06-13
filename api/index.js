const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { questions } = require('./data.json');

// Création de l'application
const app = express();
app.use(cors({ origin: process.env.CLIENT_ROOT, credentials: true }));
app.use(express.json());

module.exports.calculateCarbonFootprint = (responses, res = { status: () => { send: () => 0 } }) => {
    if (!responses) {
        return res.status(404).send('Résultat non trouvé');
    }
    let acc = 0;
    for (const categorieQuestions of Object.values(questions)) {
        for (const question of categorieQuestions) {
            const response = responses[question.name];
            if (response === undefined) {
                continue;
            }
            if (question.type === "entier") {
                acc += question.carbone * parseInt(response);
            } else if (question.type === "simple") {
                const answer = question.choix.find(r => r.name === response);
                if (answer) {
                    acc += answer.carbone * (answer.name in responses ? parseInt(responses[answer.name]) : 1);
                }
            } else if (question.type === "multiple") {
                for (const answer of question.choix) {
                    if (response.findIndex(r => r === answer.name) !== -1) {
                        acc += answer.carbone * (answer.name in responses ? parseInt(responses[answer.name]) : 1);
                    }
                }
            } else {
                return res.status(400).send('Requête invalide');
            }
        }
    }
    return acc;
}

// Ajout des middlewares et des routes
app.use('/connexion', require('./routes/connexion'));
app.use('/inscription', require('./routes/inscription'));
app.use('/utilisateur', require('./routes/utilisateur'));
app.use('/questionnaire', require('./routes/questionnaire'));
app.use('/resultat', require('./routes/resultat'));
app.use('/profil', require('./routes/profil'));

// Route protégée
const authenticateJWT = require('./middleware/autorisation');
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: "Accès autorisé" });
});

// Démarre le serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});