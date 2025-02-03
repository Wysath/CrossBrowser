const express = require('express');
const router = express.Router();
const { chromium, firefox, webkit } = require('playwright');

router.post('/preview', async (req, res) => {
  const { url } = req.body;
  const browsers = [
    { name: 'chromium', instance: chromium },
    { name: 'firefox', instance: firefox },
    { name: 'webkit', instance: webkit } // Webkit is used for Safari
  ];
  const sizes = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];

  try {
    const screenshots = await Promise.all(
      browsers.flatMap((browserType) =>
        sizes.map(async (size) => {
          console.log(`Launching ${browserType.name} browser...`);
          const browser = await browserType.instance.launch({ headless: true });
          const context = await browser.newContext({ viewport: { width: size.width, height: size.height } });
          const page = await context.newPage();
          console.log(`Navigating to ${url}...`);
          try {
            await page.goto(url, { waitUntil: 'networkidle' });
            await page.waitForTimeout(10000); // Attendre 10 secondes pour s'assurer que la page est complètement chargée
            console.log(`Taking screenshot in ${browserType.name} browser at ${size.name} size...`);
            const screenshotBuffer = await page.screenshot();
            const imageUrl = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;
            console.log(`Screenshot taken in ${browserType.name} browser at ${size.name} size.`);
            await browser.close();
            return { browser: browserType.name, size: size.name, imageUrl };
          } catch (error) {
            console.error(`Error navigating to ${url} in ${browserType.name} browser at ${size.name} size:`, error);
            await browser.close();
            throw error;
          }
        })
      )
    );
    res.json({ screenshots });
  } catch (error) {
    console.error('Error during screenshot generation:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;