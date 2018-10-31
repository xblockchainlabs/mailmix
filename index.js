const { DOMParser } = require('xmldom')
  , { readdirSync, lstatSync, existsSync, readFileSync } = require('fs')
  , { join, basename } = require('path')
  , { BaseTemplate, MessageTemplate } = require('./lib')


var baseTplts = new Map();

const tpltIndex = 'index.mjml';

exports.setBase = (refPath) => {
  const dirname = process.cwd();
  const rootDir = join(dirname, refPath);
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
    baseTplts.set(tpltName,  BaseTemplate(doc,dirPath));
  })
}

exports.template = (baseName, dir) => {
  return () => {
    const _base = baseTplts.get(baseName);
    if(_base === undefined) {
      throw Error('Missing base template');
    }
    return MessageTemplate(_base, dir);
  }
}
