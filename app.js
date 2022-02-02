const { WebScrape } = require('./scrapper.js');
const { DynamicWebScrape } = require('./scrapperDynamic.js');

let obj = new WebScrape('https://wpmet.com/most-common-wordpress-errors/');

//obj.content().then(data => console.log(data))


let dynamic = new DynamicWebScrape('https://wpmet.com/most-common-wordpress-errors/');
//let dynamic = new DynamicWebScrape('https://wpmet.com/most-common-wordpress-errors/');

dynamic.content().then(data => console.log(data))