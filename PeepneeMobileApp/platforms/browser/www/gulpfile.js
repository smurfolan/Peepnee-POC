'use strict';
 
var gulp=require('gulp');
var sass=require('gulp-sass')
var del=require('del');
gulp.task('clean',function(cb){
del(['./css/main.css'],cb);
});
gulp.task('sass',function(){
gulp.src('./sass/*.scss')
.pipe(sass().on('error', sass.logError))
.pipe(gulp.dest('./css'));
});