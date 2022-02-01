const { WebScrape } = require('./scrapper.js');
const { DynamicWebScrape } = require('./scrapperDynamic.js');

let obj = new WebScrape('https://wedevs.com/blog/401785/google-analytics-ecommerce-tracking-tips');

//obj.content().then(data => console.log(1))


let dynamic = new DynamicWebScrape('https://wpmet.com/most-common-wordpress-errors/');

dynamic.content().then(data => console.log(data))
