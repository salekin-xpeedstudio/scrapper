 class WebScrape {
     constructor(url) {
         this.url = url;
     }

     async content() {
         const rp = require('request-promise');
         const url = this.url;
         const cheerio = require('cheerio');
         let result = new Object();

         return rp(url)
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
     WebScrape,
 };