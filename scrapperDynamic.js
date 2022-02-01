class DynamicWebScrape {
    constructor(url) {
        this.url = url;
    }

    async content() {
        const puppeteer = require('puppeteer');
        const url = this.url;
        const cheerio = require('cheerio');
        let result = new Object();

        return puppeteer
            .launch()
            .then(function(browser) {
                return browser.newPage();
            })
            .then(function(page) {
                return page.goto(url).then(function() {
                    return page.content();
                });
            })
            .then(html => {
                const $ = cheerio.load(html, null, false);
                result.title = $('title').text();
                result.description = $('meta[name="description"]').attr('content');
                result.url = url;
                result.favicon = $('link[rel="icon"]').attr('href');
                result.content = [];

                let headings = $('h1, h2, h3, h4, h5, h6');
                for (let i = 0; i < headings.length; i++) {
                    let newObj = { text: $(headings[i]).text().replace(/[^\x00-\x7F]/g, "").trim(), tag: $(headings[i])[0].name }
                    newObj.text = newObj.text.replaceAll('\n', ' ');
                    newObj.text = newObj.text.replaceAll('\t', ' ');
                    newObj.text = newObj.text.replace(/  +/g, ' ');

                    result.content.push(newObj)
                }

                return result;
            })

        .catch(function(err) {
            return err
        });
    }
}

module.exports = {
    DynamicWebScrape,
};