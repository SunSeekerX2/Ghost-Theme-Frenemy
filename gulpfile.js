/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-05-11 10:34:47
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-05-31 12:15:35
 */

/**
 * @name 引入node核心模块
 */
const fs = require('fs')
const path = require('path')

/**
 * @name 引入依赖
 */
const { series, watch, src, dest, parallel } = require('gulp')
const pump = require('pump')
const livereload = require('gulp-livereload')
const webpack = require('webpack-stream')
const postcss = require('gulp-postcss')
const zip = require('gulp-zip')
const uglify = require('gulp-uglify')
const beeper = require('beeper')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const del = require('del')
// const connect = require('gulp-connect')

const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV === 'development'
// gulp plugins and utils

// postcss plugins
const autoprefixer = require('autoprefixer')
const colorFunction = require('postcss-color-function')
const cssnano = require('cssnano')
const customProperties = require('postcss-custom-properties')
const easyimport = require('postcss-easy-import')

/**
 * @name 引入配置文件
 */
const buildConfig = require('./src/config/build')

function serve(done) {
  livereload.listen()
  // connect.server({
  //   host: '0.0.0.0',
  //   port: 2368,
  //   livereload: true,
  // })
  done()
}

// sass.compiler = require('node-sass')

const handleError = (done) => {
  return function (err) {
    if (err) {
      beeper()
    }
    return done(err)
  }
}

function hbs(done) {
  pump(
    [
      src(['*.hbs', 'partials/**/*.hbs', '!node_modules/**/*.hbs']),
      livereload(),
    ],
    handleError(done)
  )
}

function css(done) {
  const processors = [
    easyimport,
    customProperties({ preserve: false }),
    colorFunction(),
    autoprefixer(),
    cssnano(),
  ]

  // main
  pump(
    [
      src('src/scss/main.scss', { sourcemaps: false }),
      sass().on('error', sass.logError),
      postcss(processors),
      rename({ suffix: '.min' }),
      dest('assets/css/', { sourcemaps: '.' }),
      livereload(),
    ],
    handleError(done)
  )

  // app
  pump(
    [
      src('src/scss/app.scss', { sourcemaps: false }),
      sass().on('error', sass.logError),
      postcss(processors),
      rename({ suffix: '.min' }),
      dest('assets/css/', { sourcemaps: '.' }),
      livereload(),
    ],
    handleError(done)
  )
}

function js(done) {
  pump(
    [
      src('src/js/index.js'),
      webpack({
        watch: isDev ? true : false,
        mode: NODE_ENV,
        output: {
          filename: '[name].min.js',
        },
        devtool: isDev ? 'source-map' : false,
        resolve: {
          // 设置别名
          alias: {
            // 这样配置后 @ 可以指向 src 目录
            '@': path.resolve(__dirname, 'src'),
          },
        },
        module: {
          rules: [
            {
              test: /\.js$/, // 处理以.js结尾的文件
              exclude: /node_modules/, // 处理除了nodde_modules里的js文件
              loader: 'babel-loader', // 用babel-loader处理
            },
          ],
        },
      }),
      // uglify(),
      dest('assets/js/'),
      livereload(),
    ],
    handleError(done)
  )
}

function deleteSource() {
  return del([
    'source',
    // 这里我们使用一个通配模式来匹配 `mobile` 文件夹中的所有东西
    // 'dist/mobile/**/*',
    // // 我们不希望删掉这个文件，所以我们取反这个匹配模式
    // '!dist/mobile/deploy.json',
  ])
}

// 移动文件替换hbs静态内容，准备替换文件内容
function moveToSource(done) {
  pump(
    [
      // 准备需要移动的文件
      src([
        '**',
        '!node_modules',
        '!node_modules/**',
        '!dist',
        '!dist/**',
        '!src',
        '!src/**',
        '!source',
        '!source/**',
        '!gulpfile.js',
      ]),
      // 移动
      dest('./source'),
    ],
    handleError(done)
  )
}

function replaceSource() {
  console.log('替换文件')
  try {
    // 备案信息
    const data = fs.readFileSync('./source/default.hbs', 'utf8')
    const res = data.replace('$siteRecord.name$', buildConfig.record.siteRecord.name)

    // 写入文件
    fs.writeFileSync('./source/default.hbs', res, 'utf8')
  } catch (error) {
    console.log('文件操作出错>>>', error)
  }

  return Promise.resolve('the value is ignored')
}

function zipperSouce(done) {
  const targetDir = 'dist/'
  const themeName = require('./package.json').name
  const filename = themeName + '.zip'

  pump(
    [
      src([
       'source/**'
      ]),
      zip(filename),
      dest(targetDir),
    ],
    handleError(done)
  )

  // pump(
  //   [
  //     src(['**', '!node_modules', '!node_modules/**', '!dist', '!dist/**', '!src', '!src/**']),
  //     zip(filename),
  //     dest(targetDir),
  //   ],
  //   handleError(done)
  // )
}


function zipper(done) {
  const targetDir = 'dist/'
  const themeName = require('./package.json').name
  const filename = themeName + '.zip'

  pump(
    [
      src([
        '**',
        '!node_modules',
        '!node_modules/**',
        '!dist',
        '!dist/**',
        '!src',
        '!src/**',
      ]),
      zip(filename),
      dest(targetDir),
    ],
    handleError(done)
  )

  // pump(
  //   [
  //     src(['**', '!node_modules', '!node_modules/**', '!dist', '!dist/**', '!src', '!src/**']),
  //     zip(filename),
  //     dest(targetDir),
  //   ],
  //   handleError(done)
  // )
}

// const cssWatcher = () => watch(['assets/main/main.scss'], css)
const cssWatcher = () => watch(['src/scss/**'], css)
const jsWatcher = () => watch('src/js/*.js', js)
// const hbsWatcher = () =>
//   watch(['*.hbs', 'partials/**/*.hbs', '!node_modules/**/*.hbs'], hbs)
const hbsWatcher = () =>
  watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs)
// const watcher = parallel(cssWatcher, hbsWatcher)
const watcher = parallel(cssWatcher, jsWatcher, hbsWatcher)
const build = series(css, js)
const dev = series(build, serve, watcher)

exports.default = dev
exports.build = build
exports.zip = series(build, zipper)
// 打包主题
exports.buildSource = series(build, deleteSource, moveToSource, replaceSource, zipperSouce)
