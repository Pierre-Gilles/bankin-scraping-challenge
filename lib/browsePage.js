const waitForData = require('./utils/waitForData');

/**
 * This function browse a page and returns the data needed
 */
module.exports = (browser, websiteUrl, iteration) => {
    console.log('Starting page ' + iteration);

    var page;
    
    // we create a new page instance
    return browser.newPage()
        .then((newPage) => {

            page = newPage;

            // of course if this dummy website opens a dialog
            // we close it immediately
            page.on('dialog', dialog => {      
                dialog.dismiss();
                page.click('#btnGenerate');
            });

            // we go the URL
            return page.goto(websiteUrl + `?start=${iteration}`, {waitUntil: 'domcontentloaded'});
        })
        
        // we wait for the data to appear
        .then(() => waitForData(page))
        .then((entries) => page.close().then(() => entries));
};