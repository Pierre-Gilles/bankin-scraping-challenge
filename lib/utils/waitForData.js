const parseTable = require('./parseTable');
const parseIframe = require('./parseIframe');
const mesureExecutionTime = require('./mesureExecutionTime');

module.exports = (page) => {
    return new Promise(function(resolve, reject){

        var start = process.hrtime();
        
        // if we detect the table directly in the page
        page.waitForSelector(`#dvTable tr`)
            .then((selector) => page.evaluate(parseTable))
            .then((data) => resolve(data))
            .then(() => mesureExecutionTime(start, 'Fetching + rendering page with table took'))
            .catch(() => {});
        
        // if we detect the famous iframe 
        page.waitForSelector(`#fm`)
            .then((selector) => page.evaluate(parseIframe))
            .then((data) => resolve(data))
            .then(() => mesureExecutionTime(start, 'Fetching + rendering page with iframe took'))
            .catch(() => {});
    });
};  