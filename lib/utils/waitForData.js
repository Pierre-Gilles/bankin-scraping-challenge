const parseTable = require('./parseTable');
const parseIframe = require('./parseIframe');

module.exports = (page) => {
    return new Promise(function(resolve, reject){
        
        // if we detect the table directly in the page
        page.waitForSelector(`#dvTable tr`)
            .then((selector) => page.evaluate(parseTable))
            .then((data) => resolve(data))
            .catch(() => {});
        
        // if we detect the famous iframe 
        page.waitForSelector(`#fm`)
            .then((selector) => page.evaluate(parseIframe))
            .then((data) => resolve(data))
            .catch(() => {});

    });
};  