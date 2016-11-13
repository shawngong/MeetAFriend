const gruntLoad = require('load-grunt-tasks');

module.exports = function init(grunt) {
  gruntLoad(grunt);

  grunt.initConfig({
    env: {
      test: {
        JUNIT_REPORT_PATH: 'artifacts/tests/test.xml',
        NODE_ENV: 'test'
      }
    },
    eslint: {
      options: {
        config: '.eslintrc.json',
        globals: ['it', 'describe', 'before', 'after', 'afterEach', 'beforeEach']
      },
      target: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', 'assets/jsx/**/*.{js,jsx}']
    },
    watch: {
      eslint: {
        files: [
          'src/**/*.js',
          'test/**/*.js',
          'config/*.json',
          'lib/**/*.js',
          'assets/jsx/**/*.{js,jsx}'
        ],
        tasks: ['eslint'],
        interrupt: true,
        options: {
          debounceDelay: 250
        }
      }
    },
    exec: {
      gitRev: {
        cmd: 'echo "{\\"current\\":\\"`git rev-parse HEAD`\\"}" > ./version.json'
      }
    },
    mocha_istanbul: {
      test: {
        options: {
          reporter: 'mocha-jenkins-reporter',
          root: './src/personas',
          coverageFolder: 'artifacts/coverage',
          grep: grunt.option('mocha-grep'),
          istanbulOptions: ['--include-all-sources']
        },
        src: ['test/unit/**/*-test.js', 'test/integration/**/*-test.js']
      },
      functional: {
        options: {
          reporter: 'mocha-jenkins-reporter',
          root: './src/personas',
          coverageFolder: 'artifacts/coverage',
          grep: grunt.option('mocha-grep')
        },
        src: ['test/**/*-test.js']
      }
    }
  });

  grunt.registerTask('build', ['env:test', 'eslint']);
  grunt.registerTask('functional', ['env:test', 'mocha_istanbul:functional']);
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('screwdriver', ['env:test', 'mocha_istanbul:test']);
  grunt.registerTask('test', ['env:test', 'eslint', 'mocha_istanbul:test']);
};
