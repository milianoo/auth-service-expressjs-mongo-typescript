const gulp = require('gulp');
// const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
const tslint = require("gulp-tslint");
// const replace = require('gulp-replace');


// const tsProject = ts.createProject('tsconfig.json');

gulp.task('tslint', () =>

    gulp.src("./src/**/*.ts")
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }))
);

gulp.task('copy-files', [], () => {

    gulp.src('config/*.json')
        .pipe(gulp.dest('build/config'));

    gulp.src('src/*.json')
        .pipe(gulp.dest('build/dist'));

    return gulp.src(
        [
            'package.json',
            'ecosystem.config.js'
        ])
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['copy-files'], () => {

    return gulp.src('src/**/*.ts')
        .pipe(ts())
        .pipe(gulp.dest('build/dist'));
});

gulp.task('watch', ['build'], () => {
    gulp.watch('src/**/*', ['tslint', 'build']);
});

gulp.task('default', ['watch']);