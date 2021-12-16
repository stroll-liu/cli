const fs = require('fs');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');
const stylus = require('gulp-stylus');
const {
  task, src, series, dest,
} = require('gulp');

task('cleanCss', () => {
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
});
task(
  'rewriteCssVar',
  () => new Promise(
    (res, rej) => {
      try {
        fs.writeFileSync('./templates/stylus/common/variable.styl', fs.readFileSync('./variable.styl'), 'utf-8');
        res(true);
      } catch (error) {
        rej(error);
      }
    },
  ),
);
task(
  'css',
  series(
    'cleanCss',
    'rewriteCssVar',
    () => src('templates/stylus/*.styl')
      .pipe(stylus({
        // compress: true, // 压缩
        // rawDefine: { $a: 'red' }, // 变量
      }))
      .pipe(dest('theme')),
  ),
);

task('cleanJs', () => {
  if (fs.existsSync('dist')) {
    return src('dist')
      .pipe(clean());
  }
  return new Promise((res, rej) => {
    fs.mkdir('dist', (error) => {
      if (error) {
        return rej(error);
      }
      return res(true);
    });
  });
});
task(
  'js',
  series(
    'cleanJs',
    () => src('src/**/*.js') // 获取原目录下所有的js文件
      .pipe(changed('dist', { extension: '.js' })) // 每次打包时，只打包内容发生改变的文件
      .pipe(uglify({
        mangle: false,
        compress: true,
      })) // 执行JS压缩
      .pipe(dest('dist')), // 输出至目标目录
  ),
);

task('default', series('css', 'js'));
