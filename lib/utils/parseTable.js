
/**
 * Returns list of account entries found in the document
 */
module.exports = () => {
    var listOfTr = document.querySelectorAll('#dvTable tr');
    var list = [];
    
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
    
    return list;
};