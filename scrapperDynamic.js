class DynamicWebScrape {
    constructor(url) {
        this.url = url;
    }
    isValidUrl(_string) {
        const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
        return matchPattern.test(_string);
    }
    htmlDecodeWithLineBreaks(html) {
        var breakToken = '_______break_______',
            lineBreakedHtml = html.replace(/<br\s?\/?>/gi, breakToken).replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + '$1' + breakToken);
        return $('<div>').html(lineBreakedHtml).text().replace(new RegExp(breakToken, 'g'), '\n');
    }
    async content() {
        const puppeteer = require('puppeteer');
        const url = this.url;
        const cheerio = require('cheerio');
        let result = new Object();

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
                    let newObj = { text: $(headings[i]).text().replace(/[^\x00-\x7F]/g, "").trim(), tag: $(headings[i])[0].name }
                        //newObj.text = newObj.text.replaceAll('\n', ' ');
                    newObj.text = newObj.text.replaceAll('\t', ' ');
                    newObj.text = newObj.text.replace(/  +/g, ' ');

                    result.content.push(newObj)

                    //console.log($(headings[i]).nextUntil($(headings[i + 1])).html());
                    console.log($(headings[i]).nextUntil($(headings[i + 1])).toString().replace(/<(form|script|footer|header|nav).*?>.*?<\/(form|script|footer|header|nav)>/g, '').replace(/<(?!\/?(p|li|div)|>)[^>]*>/gm, '').replace(/<[^>]+>/g, '\n'));
                    console.log('---');
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