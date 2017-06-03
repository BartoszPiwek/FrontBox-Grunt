/*
 * toolboxcss
 * https://github.com/root/temp
 *
 * Copyright (c) 2017 Bartosz Piwek
 * Licensed under the MIT license.
 */

'use strict';

// ADDON

// If array contains element then return true
Array.prototype.contains = function(element) {
  return this.indexOf(element) > -1;
};

module.exports = function(grunt) {

  var cheerio = require('cheerio');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('toolboxcss', 'Creat', function() {
    var options = this.options({
      class: '.',
      childPrefix: 'ch_',
      elements: [
        "ml", "mr", "mt", "mb", "margin", // margins
        "pl", "pr", "pt", "pb", "padding", // padding
        "fs", // font-size
        "bl", "br", "bt", "bb", "border", // border
        "lh", // line-height
        "mh", "xh", "mw", "xw" // width, height
      ],
      elementsProperty: [
        "margin-left", "margin-right", "margin-top", "margin-bottom", "margin", // margins
        "padding-left", "padding-right", "padding-top", "padding-bottom", "padding", // paddings
        "font-size", // font-size
        "border-left", "border-right", "border-top", "border-bottom", "border", // borders
        "line-height", // line-height
        "min-height", "max-height", "min-width", "max-width" // width, height
      ]
    });
    var automatic = this.options().dest;

    // Clean array for all class
    var outputLess = [],
      outputFile,
      outputClass = [],
      // Create RegExp for elements
      createReg = function(array) {
        var output = array.map(function(value) {
          return "^" + value + "-\\d+";
        });
        return output;
      },
      elements = new RegExp(createReg(options.elements).join("|")),
      elementsProperty = options.elementsProperty,

      // Check if element is in array
      checkClassExist = function(className) {
          var len = outputClass.length;
          for (var i = 0; i < len; i++) {
            if (outputClass[i].indexOf(className) > -1) {
              return i;
            }
          }
          return -1;
        },
        // Create List function
        createClassList = function(f) {
          // Define file variable
          var filepath = f.src, $,
          content = grunt.file.read(filepath);
          $ = cheerio.load(content, { decodeEntities: false });

          $('[class]').each(function(array) {
            $($(this).attr('class').split(' ')).each(function() {
              var className = this.valueOf();
              if (this.length > 0 && elements.test(className)) {
                var property = this.slice(0, this.indexOf("-")),
                  value = this.slice(this.indexOf("-") + 1, this.length),
                  index = checkClassExist(property);
                // grunt.log.writeln(property + " " + value + " " + index);
                if (!outputClass.length || checkClassExist(property) === -1) {
                  outputClass.push([property, elementsProperty[options.elements.indexOf(property)],value]);
                } else if (outputClass[index].indexOf(value) === -1) {
                  outputClass[index].push(value);
                }
              }
            });
          });

        };

    // Create arraay with class
    this.files.forEach(function(f) {
      createClassList(f);
    });

    // Create function LESS
    outputLess = outputClass.map(function(value) {
      return ".make-untilizer(" + value + ");";
    }).join("\n");

    // Create end file
    grunt.file.write(automatic, outputLess);
    grunt.log.writeln('File "' + automatic + '" create.');
  });

};
