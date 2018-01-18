
/**
 * Parse the Iframe
 */
module.exports = () => {
    let list = [];
    if (document.getElementById('fm')) {
        let listOfTr = document.getElementById('fm').contentWindow.document.body.querySelectorAll('table tr');
            
        listOfTr.forEach((element) => {
            var row = element.querySelectorAll('td');
                if(row && row.length == 3){
                    list.push({
                        Account: row[0].innerText,
                        Transaction: row[1].innerText,
                        Amount: parseInt(row[2].innerText.slice(0, -1)),
                        Currency: row[2].innerText[row[2].innerText.length -1]
                    });
                }
        });
    }
    return list;
};