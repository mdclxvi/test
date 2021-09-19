
const path = require('path');
const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const svgsprite = require('gulp-svg-symbols');
const newer = require('gulp-newer');
const del = require('del');
const rollupStream = require('@rollup/stream');
const source = require('vinyl-source-stream');
const { terser } = require('rollup-plugin-terser');
const alias = require('@rollup/plugin-alias');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');

const production = process.argv.every(arg => arg !== '--development');
const baseDir = 'docs';
const targetDir = `${baseDir}/static`;
const sourceDir = 'src';


function browsersync() {
  browserSync.init({
    server: { baseDir: `${baseDir}/` },
    notify: false,
    online: true
  })
}

function scripts() {
  const customResolver = resolve({ extensions: ['.mjs', '.js', '.json', '.scss'] });
  const projectRootDir = path.resolve(__dirname);

  const plugins = [
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(projectRootDir, sourceDir)
          // OR place `customResolver` here. See explanation below.
        }
      ],
      customResolver
    }),
    resolve(),
    commonjs()
  ];

  if (production) {
    plugins.push(terser());
  }

  const options = {
    input: `${sourceDir}/js/main.js`,
    output: [{
      format: 'iife',
      sourcemap: production ? undefined : 'inline',
    }],
    plugins
  };

  return rollupStream(options)
    .pipe(source('main.min.js')) // a little hack this is the output filename
    .pipe(dest(`${targetDir}/js/`))
    .pipe(browserSync.stream())
}

function styles() {
  return src(`${sourceDir}/style/**/*.scss`)
    .pipe(sass())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'], grid: true }))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ }))
    .pipe(dest(`${targetDir}/style/`))
    .pipe(browserSync.stream())
}

function images() {
  return src(`${sourceDir}/img/**/*`)
    .pipe(newer(`${targetDir}/img/`))
    .pipe(imagemin())
    .pipe(dest(`${targetDir}/img/`))
}

function svg() {
  return src(`${sourceDir}/svg/**/*`)
    .pipe(svgsprite({ templates: [`default-svg`] }))
    .pipe(dest(`${targetDir}/img/`))
}

function cleanimg() {
  return del(`${targetDir}/img/**/*`, { force: true })
}

function cleandist() {
  return del(`${baseDir}/**/*`, { force: true })
}

function staticcopy() {
  return src([
    'src/**/*.html',
    // 'src/manifest.webmanifest'
  ], { base: 'src' })
    .pipe(dest('docs'))
}

function startwatch() {
  watch(['src/**/*.js', '!src/**/*.min.js'], scripts);

  watch(['src/**/*.scss', '!src/**/*.min.scss'], styles);

  watch('src/**/*.html').on('change', series(staticcopy, browserSync.reload));

  watch('src/img/**/*', images);

  watch('src/svg/**/*', svg);

}

exports.browsersync = browsersync;

exports.scripts = scripts;

exports.styles = styles;

exports.images = images;

exports.svg = svg;

exports.cleanimg = cleanimg;

exports.cleandist = cleandist;

exports.build = series(cleandist, styles, scripts, images, svg, staticcopy);

exports.default = parallel(series(styles, scripts, images, svg, staticcopy, browsersync), startwatch);
