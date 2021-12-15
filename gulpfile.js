const fs = require('fs');
const gulp = require('gulp');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');
const stylus = require('gulp-stylus');

gulp.task('cleanCss', () => {
  if (fs.existsSync('theme')) {
    return gulp.src('theme')
      .pipe(clean());
  } else {
    return new Promise((res, rej) => {
      fs.mkdir('theme',function(error){
        if(error){
          return rej(error);
        }
        res(true);
      })
    })
  }
});
gulp.task('css', gulp.series('cleanCss', () => {
  return gulp.src('templates/stylis/**/*.styl')
    .pipe(stylus({
      // compress: true, // 压缩
      rawDefine: { $a: 'red' }
    }))
    .pipe(gulp.dest('theme'));
}));

gulp.task('cleanJs', () => {
  if (fs.existsSync('lib')) {
    return gulp.src('lib')
      .pipe(clean());
  } else {
    return new Promise((res, rej) => {
      fs.mkdir('lib',function(error){
        if(error){
          return rej(error);
        }
        res(true);
      })
    })
  }
});
gulp.task('js', gulp.series('cleanJs', () => {
  return gulp.src('src/**/*.js') // 获取原目录下所有的js文件
    .pipe(changed('lib', { extension: '.js' })) // 每次打包时，只打包内容发生改变的文件
    .pipe(uglify({
      mangle: false,
      compress: true,
    })) // 执行JS压缩
    .pipe(gulp.dest('lib')); // 输出至目标目录
}));

gulp.task('default', gulp.series('css', 'js'));
