const puppeteer = require('puppeteer');
const browsePage = require('./lib/browsePage');
const addToList = require('./lib/utils/addToList');
const saveJson = require('./lib/utils/saveJson');

const WEBSITE_URL = `file://${__dirname}/public/index.html`;
const CONCURRENCY = 12;

// At the end, this will contains the array of account entries
var listOfEntry = [];

// This is just an index, to be sure when inserting in the array that we don't insert
// duplicate. In this example, I'm using the Transaction field as unique ID as it's unique (Ex: "Transaction 1")
var indexOfEntry = {};    

console.time('start');

// first, we launch a chromium instance
puppeteer.launch({headless: true})
    .then((browser) => {

        var numberOfJobRunning = 0;

        /**
         * This function is a recursive function that browse a page and then call the next one
         * Of course we don't browse pages one at a time, so it calls the next one of the next batch
         * For example, if we have a concurrency of 10, the first batch will browse in parallel :
         * Batch 1 = page 0, 50, 100, 150, 200, 250, 300, 350, 400, 450
         * Batch 2 = page 500, 550, ...
         * Of course all this happens in parallel so it's pretty fast!
         * @param {*} iteration 
         * @param {*} concurrency 
         */
        function call(iteration, concurrency) {
            numberOfJobRunning++;

            // we browse the page
            return browsePage(browser, WEBSITE_URL, iteration)
                .then((entries) => {
                    numberOfJobRunning--;

                    // if we found data inside, let's go and browse the next batch
                    if(entries.length > 0){
                        addToList(indexOfEntry, listOfEntry, entries);
                        return call(iteration + 50*concurrency, concurrency);
                    } 
                    
                    // if not, and there is no more job running, let's close the browser 
                    // and gracefully exit
                    else {
                        if(numberOfJobRunning == 0) {
                            return browser.close();
                        }
                    }
                });
        }
        
        // For the first batch, let's initialize an array of promises
        var promises = [];
        for(var i  = 0; i < 10;i++) {
            promises.push(call(i*50, 10));
        }

        return Promise.all(promises);
    })
    .then(() => {
        listOfEntry = listOfEntry.sort(function(a, b){
            aNum = parseInt(a.Transaction.substr(12));
            bNum = parseInt(b.Transaction.substr(12));
            if(aNum < bNum) return -1;
            if(aNum > bNum) return 1;
            return 0;
        });
        console.log('finish');
        console.log(listOfEntry.length);
        saveJson(listOfEntry, './data.json');
        console.timeEnd('start');
    });