const handlebars = require('handlebars');

const { build, cache } = require('./lib')
  , { join, basename } = require('path');

class Mailmix {

  constructor() {
    this._baseDir = null;
    this._outputDir = null;
    this._templateDir = null;
    this._mode = 'live';
    this._final = false;
  }

  setBaseDir(dir) {
    const dirname = process.cwd();
    this._baseDir = join(dirname, dir);
  }

  setTptlDir(dir) {
    const dirname = process.cwd();
    this._templateDir = join(dirname, dir);
  }

  setOutdir(dir) {
    const dirname = process.cwd();
    this._outputDir = join(dirname, dir);
  }

  setMode(mode) {
    this._mode = mode;
  }

  init() {
    if (this._final) {
      return
    }
    if (this._mode === 'live' && this._baseDir !== null && this._outputDir !== null) {
      this._loadBase();
      this._final = true;
    }
    else if (this._mode === 'cache' && this._baseDir !== null && this._outputDir !== null && this._templateDir !== null) {
      this._loadBase();
      this._loadTemplates();
      this._saveTemplates();
      this._final = true;
    }
  }

  _loadBase() {
    build.setBase(this._baseDir);
  }

  _loadTemplates() {
    build.setTpltsInst(this._templateDir);
  }
  _saveTemplates() {
    build.savetemplate(this._outputDir);
  }

  template(basename) {
    return build.template(basename);
  }

  render(tpltNmae, data) {
    if (this._mode === 'live') {
      build.setTpltsInst(this._templateDir);
      const tplt = build.gettemplate(tpltNmae);
      const tpltbuild = tplt.build();
      const compiledTplt = handlebars.compile(tpltbuild);
      return compiledTplt(data);
    } else {
      const tplt = cache.readCache(this._outputDir, tpltNmae);
      const compiledTplt = handlebars.compile(tplt.toString());
      return compiledTplt(data);
    }
  }

}

module.exports =  new Mailmix();