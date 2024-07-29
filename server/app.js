const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path'); // Importer le module path

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir le dossier "screenshots"
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

// Route de base
app.get('/', (req, res) => {
    res.send('API is running. Use /api/tests/run-tests to execute tests.');
});

// Route pour exécuter les tests
app.post('/api/tests/run-tests', async (req, res) => {
    console.log('Received request to run tests');

    exec('node tests/test.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution des tests: ${error.message}`);
            return res.status(500).json({ error: 'Erreur lors de l\'exécution des tests' });
        }
        if (stderr) {
            console.error(`Erreur standard: ${stderr}`);
            return res.status(500).json({ error: 'Erreur lors de l\'exécution des tests' });
        }

        console.log(stdout); // Affiche le résultat des tests dans la console

        // Envoyer la réponse avec l'URL de la capture d'écran
        res.status(200).json({
            message: 'Tests exécutés avec succès',
            output: stdout,
            screenshotChrome: 'http://localhost:5000/screenshots/chrome.png', // URL de l'image Chrome
            screenshotFirefox: 'http://localhost:5000/screenshots/firefox.png' // URL de l'image Firefox
        });
        
        
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
