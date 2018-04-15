const gulp = require('gulp');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
const tslint = require("gulp-tslint");


const tsProject = ts.createProject('tsconfig.json');

gulp.task('tslint', () =>

    gulp.src("./src/**/*.ts")
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }))
);

gulp.task('build', [], () => {

    return tsProject.src()
        .pipe(ts())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['tslint', 'build'], () => {
    gulp.watch('src/**/*.ts', ['tslint', 'build']);
});

gulp.task('default', ['watch']);