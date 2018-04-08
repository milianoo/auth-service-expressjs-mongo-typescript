const gulp = require('gulp');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {

    return tsProject.src()
        .pipe(ts())

        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], () => {
    gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('default', ['watch']);