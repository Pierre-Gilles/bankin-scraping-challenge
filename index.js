const puppeteer = require('puppeteer');
const Bottleneck = require("bottleneck");
const browsePage = require('./lib/browsePage');
const addToList = require('./lib/utils/addToList');


const WEBSITE_URL = `file://${__dirname}/public/index.html`;
const CONCURRENCY = 12;
 
const limiter = new Bottleneck({
  maxConcurrent: CONCURRENCY
});

var listOfEntry = [];
var indexOfEntry = {};    

console.time('start');

var numberOfJobRunning = 0;

throttledFunction = limiter.wrap(browsePage);
puppeteer.launch({headless: true})
    .then((browser) => {

        function call(iteration, concurrency) {
            numberOfJobRunning++;
            return browsePage(browser, WEBSITE_URL, iteration)
                .then((entries) => {
                    numberOfJobRunning--;
                    if(entries.length > 0){
                        addToList(indexOfEntry, listOfEntry, entries);
                        return call(iteration + 50*concurrency, concurrency);
                    } else {
                        if(numberOfJobRunning == 0) {
                            return browser.close();
                        }
                    }
                });
        }
        
        var promises = [];
        for(var i  = 0; i < 10;i++) {
            promises.push(call(i*50, 10));
        }

        return Promise.all(promises);
    })
    .then(() => {
        console.log('finish');
        console.log(listOfEntry.length);
    })