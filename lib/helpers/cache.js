const { readFileSync } = require('fs')
  , { join, basename } = require('path');


exports.readCache = (refPath,tpltName) => {
    return readFileSync(join(refPath, `${tpltName}.hbs`));
}