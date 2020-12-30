const scraperObject = {
    url: 'https://www.goodreads.com/quotes/tag/motivational',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);
        let scrapedData = [];

        async function scrapeCurrentPage() {
            // Wait for the required DOM to be rendered
            await page.waitForSelector('.quoteText');

            let quotes = await page.$$eval('.quoteText', data => {
                // Extract the quotes from the data
                return data.map(el => el.innerText.split('\n')[0])
            });
            scrapedData.push(quotes);

            let nextButtonExist = false;
            //Arbitrary timeout need to fix
            await page.waitForTimeout(1000);
            // It checks does element exist if not it will throw error and stop script ie when it reaches 100th page
            try {
                const nextButton = await page.$eval('a.next_page', a => a.href);
                nextButtonExist = true;
            } catch (err) {
                nextButtonExist = false;
            }
            if (nextButtonExist) {
                await page.click('a.next_page');
                return scrapeCurrentPage(); // Call function recursively
            }
            return scrapedData;
        }
        let data = await scrapeCurrentPage();
        //console.log(data);
        return data;
    }
}

module.exports = scraperObject;