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
    elements;

  // Functions
  var readfile = function(path) {
    return grunt.file.read(path);
  };
  var createReg = function(array) {
    var output = "^";
    output += array.split(",").map(function(value, index) {
      if (index % 2 !== 0) {
        return;
      }
      return value+"|";
    }).join("");
    output += "-\\d+";
    return output;
  };
  var checkClassExist = function(className) {
    var len = allClass.length;
    for (var i = 0; i < len; i++) {
      if (allClass[i].indexOf(className) > -1) {
        return i;
      }
    }
    return -1;
  };

  grunt.registerMultiTask('toolboxcss', 'Creat', function() {
    // Variables
    var options = this.options(),
      database1 = readfile(options.database),
      database2 = readfile(options.database2),
      dest = options.dest,
      // Attribution
      elements = new RegExp(createReg(database1));

    // Functions
    var addClass = function(e) {
      if (e.length > 0 && elements.test(e.valueOf())) {
        // Variables
        var property = e.slice(0, e.indexOf("-")),
          index = checkClassExist(property);
        // Attribution
        if (!allClass.length || checkClassExist(property) === -1) {
          allClass.push(e);
        }
      }
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
          addClass(this);
        });
      });
    });
    // array allClass have all class in html files

    // Create end file
    grunt.file.write(dest, allClass);
    grunt.log.writeln('File "' + dest + '" create.');
  });
};
