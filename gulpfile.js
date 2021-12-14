// const fs = require('fs');
const gulp = require('gulp');
// const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');

gulp.task('clean', async (cb) => {
  // if (fs.existsSync('lib')) {
  //   await gulp.src('lib')
  //     .pipe(clean());
  // }
  await cb();
});

gulp.task('default', gulp.series('clean', async () => {
  await gulp.src('src/**/*.js') // 获取原目录下所有的js文件
    .pipe(changed('lib', { extension: '.js' })) // 每次打包时，只打包内容发生改变的文件
    .pipe(uglify({
      mangle: false,
      compress: true,
    })) // 执行JS压缩
    .pipe(gulp.dest('lib')); // 输出至目标目录
}));
