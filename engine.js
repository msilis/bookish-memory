import { chromium } from "playwright";
async function autoScroll(page, maxScrolls) {
    await page.evaluate(async (max) => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 400;
            let scrolls = 0;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                scrolls++;
                if (totalHeight >= scrollHeight || scrolls >= max * 100) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    }, maxScrolls);
}
export async function captureScreenshot(url, recipe) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: recipe.viewport || { width: 1280, height: 800 },
        userAgent: recipe.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
    });
    const page = await context.newPage();
    try {
        await page.goto(url, {
            waitUntil: recipe.waitCondition || "networkidle",
            timeout: 60000,
        });
        if (recipe.clickSelectors) {
            for (const selector of recipe.clickSelectors) {
                try {
                    await page.click(selector, { timeout: 3000 });
                }
                catch (e) {
                    console.error(`Selector ${selector} not found, skipping...`);
                }
            }
        }
        if (recipe.removeSelectors) {
            const css = `${recipe.removeSelectors.join(", ")} {display: none !important}`;
            await page.addStyleTag({ content: css });
        }
        await autoScroll(page, recipe.maxScrolls || 1);
        await page.waitForTimeout(1000);
        const timestamp = new Date().toISOString().replace(/:/g, "-");
        const path = `./output/recipe/${recipe.name}_${timestamp}.png`;
        await page.screenshot({
            path,
            fullPage: true,
            animations: "disabled",
        });
        return path;
    }
    catch (e) {
        console.error(e);
        return null;
    }
    finally {
        await browser.close();
    }
}
// For testing
const targetUrl = process.argv[2];
if (targetUrl) {
    const testRecipe = {
        name: "test",
        viewport: { width: 1280, height: 800 },
        removeSelectors: ["notice"],
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
        waitCondition: "domcontentloaded",
        maxScrolls: 1,
    };
    captureScreenshot(targetUrl, testRecipe)
        .then((path) => {
        if (path)
            console.log(`Saved to ${path}`);
    })
        .catch((err) => console.error(err));
}
else {
    console.log("Please provide a URL to capture.");
}
//# sourceMappingURL=engine.js.map