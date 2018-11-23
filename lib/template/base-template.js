const mjml2html = require('mjml');
const { XMLSerializer } = require('xmldom');
const { join, basename } = require('path');
const index = 'index.mjml';

class BaseTemplate {

  constructor(doc, dir) {
    if(doc === null || dir === null) {
      throw Error('Bad base template');
    }
    this._dir = dir;
    this._doc = doc;
    this._mixableNodes = new Map();
    this._templatize();
  }

  _templatize() {
    Object.entries(
      this._doc.documentElement.getElementsByTagName('mj-include')
    ).forEach(([key,el]) => {
      if(!isNaN(parseInt(key))) {
        const abslPath = join(this._dir, el.getAttribute('path')),
          fileName = basename(abslPath);
        // replace default referance inclusion path with absolute path
        el.setAttribute('path', abslPath);

        // filter out private components
        if(!fileName.startsWith('_')){
          this._mixableNodes.set(fileName, el);
        }
      }
    });
  }
  
  mix(node, path) {
    if(this._mixableNodes.has(node)) {
      const el = this._mixableNodes.get(node);
      el.setAttribute('path', path);
    }
  }

  hbx() {
    const _mjml=new XMLSerializer().serializeToString(this._doc);
    return mjml2html(_mjml).html;
  }
}

module.exports = (doc=null, dir=null) => {
  return new BaseTemplate(doc, dir);
}
