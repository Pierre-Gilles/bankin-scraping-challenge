/**
 * @param {Object} element One entry element {Account, transaction, Amount, Currency}
 */
module.exports = (indexOfEntry, listOfEntry, elements) => {

    elements.forEach((element) => {
        
        // we want to be sure an entry is not added twice 
        // to the database
        if(!indexOfEntry[element.Transaction]){
            listOfEntry.push(element);
            indexOfEntry[element.Transaction] = true;
        }
    });
}