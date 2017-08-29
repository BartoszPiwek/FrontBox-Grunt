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
      regex_check_svg_code = /(?:<svg inline )(.*)(?:><\/svg>)/g,
      regex_check_svg_class = /(?:class=|class=)(?:"|')(.*?)(?:"|')/g,
      regex_check_svg_src = /(?:src="|src=')(.*?)(?:"|')/g,
      regex_check_svg_begin = /<svg inline/g,
      match,
      matched_svg_path,
      matched_svg_code,
      matched_svg_class,
      matched_svg_src,
      svg_file,
      found_count = 0,
      found_total_count = 0,
      files_dont_found = 0,
      temp;


    // Loop files
    this.files.forEach(function(f) {
      found_count = 0;
      var filepath = f.src[0],
          file_content = return_file_content(filepath);
      while ((match = regex_check_svg_code.exec(file_content)) !== null ) {

        // Full <svg inline> tag
        matched_svg_code = match[0];

        // Src file
        matched_svg_src = matched_svg_code.match(regex_check_svg_src)[0];
        matched_svg_src = matched_svg_src.slice(5, matched_svg_src.length - 1);

        // Class tag
        matched_svg_class = matched_svg_code.match(regex_check_svg_class);
        if (!matched_svg_class) {
          matched_svg_class = "";
        }

        matched_svg_path = svg_directory + matched_svg_src + ".svg";

        if (grunt.file.exists(matched_svg_path)) {
          svg_file = return_file_content(matched_svg_path).replace("<svg", "<svg " + matched_svg_class);
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
      temp = grunt.util.pluralize( files_dont_found, "file/files");
      grunt.log.error("Doesn\'t found " + files_dont_found + " SVG " + temp + ". Check the log to solve the problem.");
    } else if (!found_total_count) {
      grunt.log.writeln("Doesn\'t found any autosvg tag");
    } else {
      grunt.log.ok('Total insert SVG inline: ' + found_total_count);
    }
  });
};
