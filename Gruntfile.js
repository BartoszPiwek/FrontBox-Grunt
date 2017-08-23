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

    // Configuration to be run (and then tested).
    autosvg: {
      automatic: {
        expand: true,
        src: ['*.html', "*.php"],
        cwd: 'test/autosvg',
        flatten: true,
      },
      options: {
        output_directory: "test/autosvg/output/",
        svg_directory: "test/autosvg/svg/",
        debug_log: true,
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
  grunt.registerTask('svg', ['autosvg']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'svg']);

};
