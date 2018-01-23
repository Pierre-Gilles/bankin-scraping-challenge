const puppeteer = require('puppeteer');
const browsePage = require('./lib/browsePage');
const addToList = require('./lib/utils/addToList');
const saveJson = require('./lib/utils/saveJson');

const WEBSITE_URL = `file://${__dirname}/public/index.html`;
const JSON_DESTINATION_PATH = './data.json';
const CONCURRENCY = 30;

// At the end, this will contains the array of account entries
var listOfEntry = [];

// This is just an index, to be sure when inserting in the array that we don't insert
// duplicate. In this example, I'm using the Transaction field as unique ID as it's unique (Ex: "Transaction 1")
var indexOfEntry = {};   

console.time('start');
console.log(`****** Welcome in the Bankin' Web Scraping Challenge ! ******`);


// first, we launch a chromium instance
puppeteer.launch({headless: true})
    .then((browser) => {

        var numberOfJobRunning = 0;
        var currentPage = 0;
        var finished = false;

        /**
         * This function is just an synchronous method
         * that provide the next page needed to be fetched 
         * to a pool of asynchronous fetcher.
         */
        function giveMeMyPage(){
            var myPage = currentPage;
            currentPage += 50;
            return myPage;
        }

        /**
         * This function is a recursive function that browse a page and then call the next one
         * Of course we don't browse pages one at a time, so it calls the next one needed
         * All this happens in parallel so it's pretty fast!
         */
        function call(iteration) {
            numberOfJobRunning++;

            // the current iteration is either the iteration provided in parameter (in case of retry if a page failed)
            // or the next one 
            iteration = iteration || giveMeMyPage();

            // we browse the page
            return browsePage(browser, WEBSITE_URL, iteration)
                .then((entries) => {
                    numberOfJobRunning--;

                    // if we found data inside, let's go and browse the next batch
                    if(entries.length > 0){
                        addToList(indexOfEntry, listOfEntry, entries);
                        if(!finished) return call();
                        else return null;
                    } 
                    
                    // if not, and there is no more job running, let's close the browser 
                    // and gracefully exit
                    else {
                        finished = true;
                        if(numberOfJobRunning == 0) {
                            return browser.close();
                        }
                    }
                })
                .catch((err) => {
                    return call(iteration);
                });
        }
        
        // Let's initialize N pages in our browser
        var promises = [];
        for(var i  = 0; i < CONCURRENCY;i++) {
            promises.push(call());
        }

        return Promise.all(promises);
    })
    .then(() => {

        // As we are working in parallel, we need to sort the 
        // array at the end, because all transactions are inserted 
        // in random order. 
        listOfEntry = listOfEntry.sort(function(a, b){
            aNum = parseInt(a.Transaction.substr(12));
            bNum = parseInt(b.Transaction.substr(12));
            if(aNum < bNum) return -1;
            if(aNum > bNum) return 1;
            return 0;
        });

        // we finally save the data to a JSON file
        saveJson(listOfEntry, JSON_DESTINATION_PATH);
        console.timeEnd('start');
        process.exit(0);
    });