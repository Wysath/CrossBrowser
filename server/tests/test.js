const { Builder, By, Key, until } = require('selenium-webdriver');
const { assert } = require('chai');
const fs = require('fs');
const path = require('path');

// Liste des navigateurs à tester
const browsers = ['chrome', 'firefox']; // Ajoutez d'autres navigateurs si nécessaire
const testUrl = 'https://www.figma.com'; // URL à tester

(async function runTests() {
    // Créer le dossier de capture d'écran s'il n'existe pas
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    for (const browser of browsers) {
        let driver = await new Builder().forBrowser(browser).build();
        
        try {
            await driver.get(testUrl);
            await driver.wait(until.elementLocated(By.css('header')), 10000); // Attendre un élément
            let title = await driver.getTitle();
            console.log(`Page title on ${browser}: ${title}`);
            assert.include(title, 'Figma: The Collaborative Interface Design Tool', `Expected title to include 'Figma: The Collaborative Interface Design Tool', but got '${title}'`);
            console.log(`Test passed on ${browser}`);

            // Prendre une capture d'écran
            let screenshot = await driver.takeScreenshot();
            // Créer un nom de fichier pour la capture d'écran en fonction du navigateur
            let screenshotName = `${browser}.png`; // Utiliser simplement le nom du navigateur
            let screenshotPath = path.join(screenshotDir, screenshotName);
            fs.writeFileSync(screenshotPath, screenshot, 'base64');
            console.log(`Capture d'écran enregistrée : ${screenshotPath}`);
        } catch (error) {
            console.error(`Test failed on ${browser}: ${error.message}`);
            // Prendre une capture d'écran en cas d'échec
            let screenshot = await driver.takeScreenshot();
            let errorScreenshotName = `error-${browser}.png`; // Nom d'erreur pour la capture d'écran
            let screenshotPath = path.join(screenshotDir, errorScreenshotName);
            fs.writeFileSync(screenshotPath, screenshot, 'base64');
            console.log(`Capture d'écran d'erreur enregistrée : ${screenshotPath}`);
        } finally {
            await driver.quit();
        }
    }
})();
