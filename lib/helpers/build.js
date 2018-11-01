const { DOMParser } = require('xmldom')
  , { readdirSync, lstatSync, existsSync, mkdirSync ,readFileSync , writeFileSync } = require('fs')
  , { join, basename } = require('path')
  , { BaseTemplate, MessageTemplate } = require('../template');


var baseTplts = new Map();
var tpltsInst = new Map();

const tpltIndex = 'index.mjml';
const tpltsInstIndex = "index.js";

exports.setBase = (rootDir) => {
  readdirSync(rootDir)
    .filter((dir) => {
      const dirPath = join(rootDir, dir)
        , tpltPath = join(rootDir, dir, tpltIndex);

      return (dir.indexOf('.') !== 0
        && dir.indexOf('..') !== 0
        && lstatSync(dirPath).isDirectory()
        && existsSync(tpltPath)
        && lstatSync(tpltPath).isFile());
    })
    .forEach((dir) => {
      const dirPath = join(rootDir, dir)
        , tpltPath = join(rootDir, dir, tpltIndex)
        , tpltName = basename(dirPath)
        , mjml = readFileSync(tpltPath, 'utf8');

      let doc = new DOMParser().parseFromString(mjml);
      baseTplts.set(tpltName, BaseTemplate(doc, dirPath));
    })
}

exports.setTpltsInst = (rootDir) => {
  readdirSync(rootDir)
    .filter((dir) => {
      const dirPath = join(rootDir, dir)
        , tpltPath = join(rootDir, dir, tpltsInstIndex);

      return (dir.indexOf('.') !== 0
        && dir.indexOf('..') !== 0
        && lstatSync(dirPath).isDirectory()
        && existsSync(tpltPath)
        && lstatSync(tpltPath).isFile());
    })
    .forEach((dir) => {
      const dirPath = join(rootDir, dir);
      tpltsInst.set(dir, dirPath);
    })
}

exports.gettemplate = (tpltName) => {
  const _tpltPath = tpltsInst.get(tpltName);
  const _tplt = require(_tpltPath);
  if (_tplt === undefined) {
    throw Error('Missing  template');
  }
  return _tplt(_tpltPath);
}

exports.savetemplate = (dir) => {
  const tplts = [...tpltsInst.keys()];
  if(!existsSync(dir)){
    mkdirSync(dir);
  }
  tplts.forEach((tpltName) => {
    const _tpltPath = tpltsInst.get(tpltName);
    const _tplt = require(_tpltPath);
    const inst = _tplt(_tpltPath);
    writeFileSync(`${dir}/${tpltName}.hbs`, inst.build());
  })
}

exports.template = (baseName) => {
  return (dir) => {
    const _base = baseTplts.get(baseName);
    if (_base === undefined) {
      throw Error('Missing base template');
    }
    return MessageTemplate(_base, dir);
  }
}
