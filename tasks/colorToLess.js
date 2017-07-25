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

    //===== Main Functions

    // Return database object
    var readFile = function(path) {
      return grunt.file.read(path);
    };

    //===== Variables
    var options = this.options(),
      destContent = readFile(options.variableFile),
      prefix = options.prefix,
      dest = options.variableFile,
      regCheckVar = "(" + prefix + ".*):.*(#\\w\\w\\w\\w\\w\\w)",
      regHex = /#\w\w\w\w\w\w/g,
      match,
      colorsObject = {},
      regIsHex = /^#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]/,
      unSetVar = false,
      countNewVar = 0,
      temp,
      temp2,
      regVariable = new RegExp(regCheckVar, "g"),
      varName = prefix + "variable";

    //===== Create object with define variable colors
    while (match = regVariable.exec(destContent)) {
      temp = match[0];
      temp = temp.slice(temp.indexOf(":") + 1, temp.length).replace(/ /g, "");
      if (temp[0] === "#") {
        colorsObject[match[2]] = match[1];
      }
    }


    //===== Loop files
    this.files.forEach(function(f) {
      var filepath = f.src;

      if (filepath !== dest) {

        // Variables
        var content = grunt.file.read(filepath);

        while (match = regHex.exec(content)) {
          if (regIsHex.test(match)) {
            temp2 = colorsObject[match];
            if (temp2 !== void 0 && temp2 !== varName) {
              temp = new RegExp(match);
              content = content.replace(temp, temp2);
            } else if (temp2 !== varName) {
              colorsObject[match] = varName;
              destContent += "// " + varName + ": " + match + ";\n";
            } else {
              unSetVar = true;
            }
            countNewVar++;
          }
        }
        grunt.file.write("" + filepath, content);
      }
    });

    //=========================================================================
    // Create end file
    //=========================================================================
    temp = "variable";
    if (countNewVar > 1) {
      temp += "s";
    }
    if (readFile(options.variableFile) !== destContent) {
      grunt.file.write(dest, destContent);
      grunt.log.error('Check ' + dest + " file and rename new " + temp);
      grunt.log.error('After that run task again');
    } else if (unSetVar) {
      grunt.log.error('Check file ' + dest + " and rename created " + temp);
    } else {
      grunt.log.ok('Everything is perfect :)');
    }
  });
};
