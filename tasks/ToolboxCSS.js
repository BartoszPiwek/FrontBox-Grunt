/*
 * Toolbox Grunt
 * https://github.com/BartoszPiwek/Toolbox-Grunt
 *
 * Copyright (c) 2017 Bartosz Piwek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var cheerio = require('cheerio');

  // Variables
  var allClass = [],
    outputFile = [],
    outputUnit = [],
    regex1;

  // Functions
  var readfile = function(path) {
    return grunt.file.read(path);
  };
  var createReg = function(array) {
    grunt.log.writeln(typeof array);
    var output = "^(";
    output += array.map(function(value, index) {
      if (index % 2 !== 0) {
        return;
      }
      return value+"|";
    }).join("");
    output += ")-\\d+";
    return output;
  };
  var checkClassExist = function(className, array) {
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (array[i].indexOf(className) > -1) {
        return i;
      }
    }
    return -1;
  };

  grunt.registerMultiTask('toolboxcss', 'Creat', function() {
    // Variables
    var options = this.options(),
      database1 = readfile(options.database).split(","),
      database2 = readfile(options.database2).split(","),
      dest = options.dest;
      // Attribution
      regex1 = new RegExp(createReg(database1));

    // Functions
    var createUnit = function(array) {
      var output = [],
          len = array.length;

      for (var i = 0; i < len; i++) {
        grunt.log.writeln(output);
        var className = array[i];
        // Check if className match RegEx
        if (regex1.test(className)) {
          // Variables
          var indexDash = className.indexOf("-"),
              property = className.slice(0, indexDash),
              value = className.slice(indexDash + 1, className.length),
              index = checkClassExist(property, output);
              grunt.log.writeln(index);

          if (!output.length || index === -1) {
            output.push([property, database1[database1.indexOf(property)+1],value]);
          } else if (output[index].indexOf(value) === -1) {
            output[index].push(value);
          }
        }

      }
      return output;
    };

    // Loop files
    this.files.forEach(function(f) {
      // Variables
      var filepath = f.src,
        content = grunt.file.read(filepath),
        $ = cheerio.load(content, {
          decodeEntities: false
        });
      // Attribution
      $('[class]').each(function(array) {
        $($(this).attr('class').split(' ')).each(function() {
          var name = this;
          if (allClass.indexOf(name) === -1) {
            allClass.push(name);
          }
        });
      });
    });

    // array allClass have all class in html files
    outputUnit = createUnit(allClass);

    outputFile = outputUnit.map(function(value) {
      return ".make-untilizer(" + value + ");";
    }).join("\n");

    // Create end file
    grunt.file.write(dest, outputFile);
    grunt.log.writeln('File "' + dest + '" create.');
  });
};
