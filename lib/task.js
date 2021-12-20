const fs = require('fs');
const path = require('path');
const clean = require('gulp-clean');
const stylus = require('gulp-stylus');

const {
  src, dest,
} = require('gulp');
const ora = require('ora'); // 加载效果

const config = require('./config');

exports.fonts = (opts) => {
  const spin = ora('打包字体图标 ...').start();
  const stream = src(path.resolve('./../templates/fonts/**'))
    .pipe(dest(path.resolve(opts.out || config.out, './fonts')))
    .on('end', () => {
      spin.succeed();
    });

  return stream;
};
exports.cleanCss = () => {
  if (fs.existsSync('theme')) {
    return src('theme')
      .pipe(clean());
  }
  return new Promise((res, rej) => {
    fs.mkdir('theme', (error) => {
      if (error) {
        return rej(error);
      }
      return res(true);
    });
  });
};
exports.buildCss = () => src('templates/stylus/*.styl')
  .pipe(stylus({
    // compress: true, // 压缩
    // rawDefine: { $a: 'red' }, // 变量
  }))
  .pipe(dest('theme'));
exports.rewriteCssVar = () => new Promise(
  (res, rej) => {
    try {
      fs.writeFileSync('./templates/stylus/common/variable.styl', fs.readFileSync('./variable.styl'), 'utf-8');
      res(true);
    } catch (error) {
      rej(error);
    }
  },
);

exports.cleanJs = () => {
  if (fs.existsSync(path.resolve(__dirname, './../dist'))) {
    return src(path.resolve(__dirname, './../dist'))
      .pipe(clean());
  }
  return new Promise((res, rej) => {
    fs.mkdir(path.resolve(__dirname, './../dist'), (error) => {
      if (error) {
        return rej(error);
      }
      return res(true);
    });
  });
};
