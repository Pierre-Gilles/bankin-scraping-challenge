const fs = require('fs');

module.exports = (data, path) => {
    console.log('Writing JSON data to ' + path);
    return fs.writeFileSync(path, JSON.stringify(data, null, 4));
};