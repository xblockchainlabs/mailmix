const { readdirSync } = require('fs')
, { join } = require('path')
, _ = require('lodash');

class MessageTemplate {
  constructor(base, dir) {
     if(base === null || dir === null) {
      throw Error('Bad template construct');
    }
    this._dir = dir;
    this._base = _.cloneDeep(base);
    this._mixing();
  }

  _mixing() {
    readdirSync(this._dir)
    .filter((dir) => {
      return (dir.indexOf('.') !== 0 && dir.indexOf('..') !== 0 && (dir.slice(-5) === '.mjml'));
    })
    .forEach((file) => {
      const node = file,
      path = join(this._dir, file);
      this._base.mix(node, path);
    });
  }

  build() {
    return this._base.hbx();
  }
}

module.exports = (base=null, dir=null) => {
  return new MessageTemplate(base, dir);
}