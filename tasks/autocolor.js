/*
 * Color to CSS Preprocessors
 * https://github.com/BartoszPiwek/FrontBox-Grunt
 *
 * Copyright (c) 2017 Bartosz Piwek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('autocolor', 'Creat', function() {

    // Return database file
    var readFile = function(path) {
      return grunt.file.read(path);
    };

    // Main variables
    var options = this.options(),
      // variableFile content
      destContent = readFile(options.variableFile),
      // variableFile path
      dest = options.variableFile,
      // preprocessor prefix
      prefix = options.prefix,
      // REGEXP
      // syntax for search variables in "variableFile" content
      regCheckVar = "(" + prefix + ".*):.*(#\\w\\w\\w\\w\\w\\w)",
      // first search hex colors
      regHex = /#\w\w\w\w\w\w/g,
      // second seach hex colors
      regIsHex = /^#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]/,
      // object with colors from "variableFile"
      colorsObject = {},
      // LOG
      unSetVar = false,
      countNewVar = 0,
      // TEMP VAR
      match,
      temp,
      temp2,
      // default variable syntax
      varName = prefix + "variable",
      // create RegExp for search variables in "variableFile" content
      regVariable = new RegExp(regCheckVar, "g");

    // Fill object with colors in "destContent" file
    while (match = regVariable.exec(destContent)) {
      temp = match[0];
      temp = temp.slice(temp.indexOf(":") + 1, temp.length).replace(/ /g, "");
      temp2 = match[2].toUpperCase();
      if (temp[0] === "#") {
        colorsObject[temp2] = match[1];
        // Convert variables name to uppercase letter
        destContent = destContent.replace(temp, temp2);
      }
    }

    // Loop files
    this.files.forEach(function(f) {
      var filepath = f.src[0];

      //
      if (filepath !== dest) {
        // Variables
        var content = grunt.file.read(filepath);

        while (match = regHex.exec(content)) {
          if (regIsHex.test(match)) {
            match = match[0];
            temp = new RegExp(match);
            match = match.toUpperCase();
            temp2 = colorsObject[match];
            if (temp2 !== void 0 && temp2 !== varName) {
              content = content.replace(temp, temp2);
            } else if (temp2 !== varName) {
              colorsObject[match] = varName;
              destContent += "// " + varName + ": " + match + "; // " + filepath + "\n";
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

    // Set log information count
    temp = grunt.util.pluralize( countNewVar, "variable/variables");
    console.log(countNewVar);
    // Print end message
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
