import gulp from 'gulp';
import tar from 'gulp-tar';
import gzip from 'gulp-gzip';
import debug from 'gulp-debug';
import babel from 'gulp-babel';
import packageObject from './package.json';

gulp.task('copy', () => {
    gulp.src('./src/public')
        .pipe(debug())
        .pipe(gulp.dest('./dist'))
});

gulp.task('babel', ['copy'], () =>
    gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./dist'))
);
gulp.task('build', ['babel'], () => {
    const sources = [
        'dist/**/*',
        'package.json',
        'yarn.lock',
        '.env',
        'app.yaml',
        'dispatch.yaml',
        'rsa_private.pem'
    ];
    return gulp.src(sources)
        // .pipe(tar(`${packageObject.name}-${packageObject.version}.tar`, { mode: null }))
        // .pipe(gzip())
        .pipe(gulp.dest('./deploy'));
});

gulp.task('default', ['build']);
