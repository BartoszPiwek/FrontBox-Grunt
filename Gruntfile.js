/*
 * toolboxcss
 * https://github.com/root/temp
 *
 * Copyright (c) 2017 Bartosz Piwek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['less']
    },

    // Configuration to be run (and then tested).
    toolboxcss: {
      automatic: {
        expand: true,
        src: '*.html',
        cwd: 'template/',
        flatten: true,
      },
      options: {
        dest: "less/_automatic.less",
        database: "tasks/toolboxdata.json",
      }
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'toolboxcss']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
