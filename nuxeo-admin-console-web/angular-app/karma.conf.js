module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/nuxeoadmin'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false, // set to false to disable watching files
    browsers: ['ChromeCustom'], // Use custom Chrome launcher
    singleRun: true,
    restartOnFileChange: false, // set to false to disable restart on file change
    customLaunchers: {
      ChromeCustom: {
        base: 'ChromeHeadless',
        flags: ['--headless', '--disable-gpu', '--no-sandbox']
      }
    },
    browserNoActivityTimeout: 30000,
    captureTimeout: 30000,
    processKillTimeout: 3000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3
  });
};
