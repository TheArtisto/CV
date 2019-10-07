const {task, series, parallel, src, dest, watch} = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const notify = require('gulp-notify');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');

const plugins = [
  autoprefixer({
    browsers: [
      'last 5 versions',
      '> 1%'
    ],
    cascade: true
  }),
  mqpacker()
];

const path = {
  scssStyle: './assets/scss/style.scss',
  scssFiles: './assets/scss/**/*.scss',
  scssFolder: './assets/scss',
  cssFolder: './assets/css',
  htmlFiles: './*.html'
};

function scss() {
  return src(path.scssStyle).
    pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)).
    pipe(postcss(plugins)).
    pipe(csscomb()).
    pipe(dest(path.cssFolder)).
    pipe(browserSync.reload({stream: true}));
}

function scssMin() {
  const pluginsExtend = plugins.concat([cssnano({preset: 'default'})]);

  return src(path.scssStyle).
    pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)).
    pipe(postcss(pluginsExtend)).
    pipe(csscomb()).
    pipe(rename({suffix: '.min'})).
    pipe(dest(path.cssFolder)).
    pipe(browserSync.reload({stream: true}));
}

function scssDev() {
  return src(path.scssStyle, {sourcemaps: true}).
    pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)).
    pipe(dest(path.cssFolder, {sourcemaps: true})).
    pipe(browserSync.reload({stream: true}));
}

function comb() {
  return src(path.scssFiles).
    pipe(csscomb()).
    on(
      'error',
      notify.onError(function (err) {
        return 'File: ' + err.message;
      })
    ).
    pipe(dest(path.scssFolder));
}

function syncInit() {
  browserSync({
    server: {baseDir: './'},
    notify: false
  });
}

async function sync() {
  browserSync.reload();
}

function watchFiles() {
  syncInit();
  watch(path.scssFiles, scss);
  watch(path.htmlFiles, sync);
}

task('min', scssMin);
task('dev', scssDev);
task('scss', scss);
task('comb', comb);
task('watch', watchFiles);