module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      './public/js/**/*.js',
      './public/js/**/*.spec.js'
    ],
    exclude: [
      './public/js/app.min.js'
    ],
    phantomjsLauncher: {
      exitOnResourceError: true
    }
  });
};