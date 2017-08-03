/*
 * FrontBox-Grunt
 * https://github.com/BartoszPiwek/FrontBox-Grunt
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
    autoclass: {
      automatic: {
        expand: true,
        src: ['*.html', "*.php"],
        cwd: 'template/',
        flatten: true,
      },
      options: {
        dest: "less/automatic.less",
        destResponsive: "less/responsive.less",
        database: "grunt/autoclass.json",
      }
    },

    autocolor: {
      automatic: {
        expand: true,
        src: '**',
        cwd: 'less/',
        filter: 'isFile'
      },
      options: {
        variableFile: "less/variables/_colors.less",
        prefix: "@",
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
  grunt.registerTask('class', ['autoclass']);
  grunt.registerTask('color', ['autocolor']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'class']);

};
