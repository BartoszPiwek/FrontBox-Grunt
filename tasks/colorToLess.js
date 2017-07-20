/*
 * Color to LESS
 * https://github.com/BartoszPiwek/FrontBox-Grunt
 *
 * Copyright (c) 2017 Bartosz Piwek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('colortoless', 'Creat', function() {

    // Return database object
    var readFile = function(path) {
      return grunt.file.read(path);
    };

    //===== Variables
    var options = this.options(),
      destContent = readFile(options.variableFile),
      dest = options.variableFile,
      regVariable = /(@.*):.*(#\w\w\w\w\w\w)/g,
      regHex = /#\w\w\w\w\w\w/g,
      match,
      colorsObject = {},
      regIsHex = /^#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]/;

    //===== Create object with define variable colors
    while (match = regVariable.exec(destContent)) {
      colorsObject[match[2]] = match[1];
    }

    //===== Loop files
    this.files.forEach(function(f) {

      // Variables
      var filepath = f.src,
          content = grunt.file.read(filepath),
          regTemp;
      while (match = regHex.exec(content)) {
        if (regIsHex.test(match)) {
          if (colorsObject[match] !== void 0 && colorsObject[match] !== "@variable") {
            regTemp = new RegExp(match);
            content = content.replace(regTemp, colorsObject[match]);
          } else {
            if (colorsObject[match] !== "@variable") {
              colorsObject.match = "";
              destContent += "// @variable: " + match + ";\n";
            }
          }
        }
      }
      grunt.file.write("" + filepath, content);
    });

    //=========================================================================
    // Create end file
    //=========================================================================
    if (readFile(options.variableFile) !== destContent) {
      grunt.file.write(dest, destContent);
      grunt.log.writeln('File "' + dest + '" create.');
      grunt.log.error('Check ' + dest + " file and rename new variable/s");
      grunt.log.error('After that run task again');
    } else {
      grunt.log.ok('Everything is perfect :)');
    }
  });
};
