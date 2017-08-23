/*
 * Insert inline SVG in HTML
 * https://github.com/BartoszPiwek/FrontBox-Grunt
 *
 * Copyright (c) 2017 Bartosz Piwek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('autosvg', 'Creat', function() {

    // Return database file
    var return_file_content = function(path) {
      return grunt.file.read(path);
    };

    // Main variables
    var options = this.options(),
      output_directory = options.output_directory,
      svg_directory = options.svg_directory,
      debug_log = options.debug_log,
      regex_check_svg_code = /(?:<!--\sicon-)(.*)(?:\s-->)/g,
      match,
      matched_svg_path,
      matched_svg_code,
      svg_file,
      found_count = 0,
      found_total_count = 0,
      files_dont_found = 0;


    // Loop files
    this.files.forEach(function(f) {
      found_count = 0;
      var filepath = f.src[0],
          file_content = return_file_content(filepath);

      while (match = regex_check_svg_code.exec(file_content)) {
        matched_svg_path = svg_directory + match[1] + ".svg";
        matched_svg_code = match[0];
        if (grunt.file.exists(matched_svg_path)) {
          svg_file = return_file_content(matched_svg_path);
          file_content = file_content.replace(matched_svg_code, svg_file);
          found_count++;
        } else {
          files_dont_found++;
          grunt.log.error("In '" + filepath + "' file '" + matched_svg_path + "' doesn\'t exist.");
        }
      }

      // Rewrite files with inline SVG
      if (found_count) {
        grunt.file.write(output_directory + f.dest, file_content);
        if (debug_log) {
          grunt.log.writeln("File '" + output_directory + f.dest + "' created. Inserted inline SVG files: " + found_count);
        }
      }

      found_total_count += found_count;

    });

    // End log
    if (files_dont_found) {
      grunt.log.error("Doesn\'t found " + files_dont_found + " SVG files. Check log to solve problem.");
    } else if (!found_total_count) {
      grunt.log.writeln("Doesn\'t found any autosvg comment block");
    } else {
      grunt.log.ok('Total insert inline files: ' + found_total_count);
    }
  });
};
