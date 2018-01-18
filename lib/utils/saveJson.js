const fs = require('fs');

module.exports = (data, path) => {
    return fs.writeFileSync(path, JSON.stringify(data, null, 4));
};