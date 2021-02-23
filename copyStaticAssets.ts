import * as shell from 'shelljs';
import pug from 'pug';
import fs from 'fs';
import path from 'path';

// Compile the template to a function string
// var jsFunctionString = pug.compileFileClient('/path/to/pugFile.pug', {name: 'fancyTemplateFun'});

// Check whether the directory exist, if not create new one;
const dirs = ['./dist', './dist/views', './dist/i18n', './dist/css', './dist/images', './dist/components'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// trasform the i18n JSON into the JS;
const _directoryPath = path.join(__dirname, 'src/i18n');
fs.readdir(_directoryPath, (err, files) => {
  if (err) {
    return console.info('Unable to scan directory: ' + err);
  }
  files.forEach(fileName => {
    const _data = fs.readFileSync(path.join(__dirname, 'src/i18n/' + fileName), 'utf8');
    const tgtFileName = fileName.replace('.json', '');
    fs.writeFileSync(`dist/i18n/${tgtFileName}.js`, `window.i18n_${tgtFileName} = ${_data};`);
  });
});

// copye the files into dist
shell.cp('-R', 'node_modules/babel-polyfill/dist/polyfill.min.js', 'dist/components');
shell.cp('-R', 'src/css/fonts', 'dist/css/fonts');
shell.cp('-R', 'src/css/iconfont.css', 'dist/css/iconfont.css');
shell.cp('-R', 'src/images', 'dist/');