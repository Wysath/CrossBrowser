const { Builder, By, Key, until } = require('selenium-webdriver');
const TestResult = require('../models/testResult');
const fs = require('fs');
const path = require('path');

const browsers = ['chrome', 'firefox']; // Ajoute Safari et Edge si nécessaire
const testUrl = 'https://www.figma.com';
const screenshotDir = path.join(__dirname, '../reports/screenshots');

// Créer le dossier pour les captures d'écran si cela n'existe pas
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

async function takeScreenshot(driver, browser) {
    const screenshotFilePath = path.join(screenshotDir, `${browser}_screenshot.png`);
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(screenshotFilePath, screenshot, 'base64');
    return screenshotFilePath;
}

async function runTest(browser) {
    let driver = await new Builder().forBrowser(browser).build();
    let report = `Testing on: ${browser}\n`;
    let screenshotPath = '';

    try {
        await driver.get(testUrl);
        await driver.wait(until.elementLocated(By.css('header')), 10000); // Modifier selon le site
        screenshotPath = await takeScreenshot(driver, browser);

        let title = await driver.getTitle();
        report += `Page title is: ${title}\n`;
        const passed = title.includes('Figma: The Collaborative Interface Design Tool');

        await TestResult.create({ browser, title, passed, screenshot: screenshotPath });
        report += passed ? 'Test passed.\n' : 'Test failed.\n';
    } catch (error) {
        report += `Test failed: ${error.message}\n`;
    } finally {
        await driver.quit();
        report += `Screenshot saved at: ${screenshotPath}\n\n`;
        return report;
    }
}

exports.runTests = async (req, res) => {
    console.log('Received request to run tests'); 
    let finalReport = '';

    for (const browser of browsers) {
        const result = await runTest(browser);
        finalReport += result;
    }

    res.json({ report: finalReport });
};
