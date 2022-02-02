class DynamicWebScrape {
    constructor(url) {
        this.url = url;
    }
    isValidUrl(string) {
        const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
        return matchPattern.test(string);
    }
    cleanText(str) {
        str = str.replace(/[^\x00-\x7F]/gm, "").trim(); //remove non-ascii characters
        str = str.replaceAll('\t', ' '); //converting all tabs into one space
        str = str.replace(/  +/gm, ' '); //converting multiple space into one
        str = str.replace(/\n+/gm, '\n'); //converting multiple new line into one [use <br> for page render]
        return str;
    }
    async content() {
        const puppeteer = require('puppeteer');
        const cheerio = require('cheerio');
        let result = {};

        return puppeteer
            .launch()
            .then(browser => {
                return browser.newPage();
            })
            .then(page => {
                return page.goto(this.url).then(function() {
                    return page.content();
                });
            })
            .then(html => {
                const $ = cheerio.load(html, null, false);
                $('form, nav, header, footer, script, figure, img').remove();
                result.title = $('title').text();
                result.description = $('meta[name="description"]').attr('content');
                result.url = this.url;
                result.favicon = $('link[rel="icon"]').attr('href');

                if (!this.isValidUrl(result.favicon)) {

                    if (this.url.slice(-1) === '/')
                        this.url = this.url.slice(0, -1)

                    if (result.favicon.slice(0, 1) === '/')
                        result.favicon = result.favicon.slice(1);

                    result.favicon = this.url + '/' + result.favicon;
                }

                result.content = [];

                let headings = $('h1, h2, h3, h4, h5, h6');

                for (let i = 0; i < headings.length; i++) {
                    let newObj = {};
                    //preparing title from heading
                    newObj.title = this.cleanText($(headings[i]).text());

                    //tag name of the heading
                    newObj.tag = $(headings[i])[0].name;

                    //getting html markup as string between current heading and next one
                    newObj.text = $(headings[i]).nextUntil($(headings[i + 1])).toString();

                    //stripping text from tags except p|li|div then stripping text with line break for rest of them
                    newObj.text = newObj.text.replace(/<(?!\/?(p|li|div)|>)[^>]*>/gm, '').replace(/<[^>]+>/gm, '\n');
                    newObj.text = this.cleanText(newObj.text);

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