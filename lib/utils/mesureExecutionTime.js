
module.exports = function(start, text){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(text + " " + process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms"); // print message + time
};