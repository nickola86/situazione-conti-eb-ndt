'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify'); // parser per i file js: minifica i file js.
var sass = require('gulp-sass'); // compila in CSS il codice scritto in SASS.
var sourcemaps = require('gulp-sourcemaps'); // servono a mappare i file minificati e/o concatenati con le loro sorgenti non minificate e non concatenate.
var autoprefixer = require('gulp-autoprefixer'); // analizza i CSS e aggiunge i prefissi necessari ai vari browser.
var minifycss = require('gulp-minify-css'); // minifica i CSS.
var gulpif = require('gulp-if'); // esegue task in maniera condizionale.
var concat = require('gulp-concat'); // concatena i file.
var plumber = require('gulp-plumber'); // gestore d'errori che (a) logga un messaggio e (b) termina nella maniera appropriata il task in corso.
var babel = require('gulp-babel'); // converte la sintassi js con Babel.
var rimraf = require('gulp-rimraf'); // rimuove i file.
var watch = require('gulp-watch'); // watcher dei file per automatizzare operazioni e deploy.

// variabili per struttura delle cartelle
var env = 'dev'; //'prod'
var distSrc = './dist/';
// Configurazione autoprefixer
var autoprefixerOptions = {
    browsers: ['last 2 versions', 'ie >= 10', 'Android >= 2.3', 'ios >= 7']
};



// Controllare questo task, capire se va bene o se cancella
// file che con gli altri task non sono di nuovo generabili.
gulp.task('clean-files', function () {
    return gulp.src([
        distSrc + '/css/*.{css,map}'
        ], { read: false })
      .pipe(rimraf());
});



// SASS del template di categoria
gulp.task('styles', function() {
  return gulp.src([
    'app/assets/scss/app.scss'
    ])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(plumber())
    .pipe(sass()) // {outputStyle: 'compressed'}
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(distSrc + 'css/'))
});



// costruisce tutti i file CSS e js
gulp.task('default', ['styles', 'image-optim']);