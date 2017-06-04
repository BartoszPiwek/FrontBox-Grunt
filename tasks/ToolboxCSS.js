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
    outputFile = '@import "automatic.less";\n',
    outputUnit = [],
    outputUnunit = [];

  //===== Functions

  // Return one RegExp
  var createReg = function(object) {
    var unit = object.unit,
        gap = object.gap,
        output = "^(";
    output += unit.map(function(value, index) {
      if (index % 2 !== 0) {
        return;
      }
      return value + "|";
    }).join("");
    output += ")" + gap + "\\d+";
    return [new RegExp(output), gap];
  };

  // Return database object
  var readDatabase = function(path) {
    grunt.log.writeln("Read database: " + path + "\n");
    return grunt.file.readJSON(path);
  };

  // Return array with RegExp
  var regLoop = function(database) {
      var keys = Object.keys(database),
          length = keys.length,
          output = [];
    for (var i = 0; i < length; i++) {
      grunt.log.writeln("Create RegExp: " + i);
      output.push(createReg(database["field"+i]));
    }
    grunt.log.writeln("End read database: \n" + output + "\n");
    return output;
  };

  // Return number of usage array
  var checkClassExist = function(className, array, index) {
    grunt.log.writeln("checkClassExist: " + array[index]);
    var len = array[index].length;
    for (var i = 0; i < len; i++) {
      if (array[index][i].indexOf(className) > -1) {
        return i;
      }
    }
    return -1;
  };

  grunt.registerMultiTask('toolboxcss', 'Creat', function() {
    // Variables
    var options = this.options(),
      database = readDatabase(options.database),
      dest = options.dest;

    //===== Functions

    // Return database type number
    var checkType = function(className ,reg) {
      grunt.log.writeln("Check type for: " + className);
      var databaseLength = Object.keys(database).length;
      for (var i = 0; i < databaseLength; i++) {
        if (reg[i][0].test(className)) {
          grunt.log.writeln("End check type: " + i);
          return i;
        }
        grunt.log.writeln("No in: " +reg[i]);
      }
      grunt.log.writeln("End check type: -1");
      return -1;
    };

    // Return full array with class
    var createUnit = function(array) {
      var output = [],
          len = array.length,
          reg = regLoop(database),
          keys = Object.keys(database);
      for (var i = 0; i < len; i++) {
        var className = array[i];
        var typedata = checkType(className, reg);
        // Check if className match RegEx
        if (typedata !== -1) {
          // Variables
          var indexDash = className.indexOf(reg[typedata][1]),
            property = className.slice(0, indexDash),
            value = className.slice(indexDash + 1, className.length),
            indexArray = typedata/2;
            grunt.log.writeln("Value - " + value + "\n" + "Property - " + property);

          // If property dont exist in array
          if (!output[indexArray]) {
            output.push([]);
          }

          var index = checkClassExist(property, output, indexArray);

          if (!output[indexArray][index] || index === -1) {
            var unit = database[keys[typedata]][database[keys[typedata]].indexOf(property)+1];
            grunt.log.writeln("Unit - " + unit + "\n");
            // If array dont exist
            if (!output[typedata/2]) {
              output.push([]);
            }
            output[typedata/2].push([property, unit, value]);
            // If array exist
          } else if (output[typedata/2][index].indexOf(value) === -1) {
            grunt.log.writeln("Add value for " + property);
            output[typedata/2][index].push(value);
            grunt.log.writeln();
          }
        } else {
          grunt.log.writeln("Skip: " + className + "\n");
        }
      }
      return output;
    };
    grunt.log.writeln("Function start ...\n");
    grunt.log.writeln("Loop files:");
    // Loop files
    this.files.forEach(function(f) {
      // Variables
      var filepath = f.src,
        content = grunt.file.read(filepath),
        $ = cheerio.load(content, {
          decodeEntities: false
        });
        grunt.log.writeln(filepath);
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
    grunt.log.writeln("\nCreate full array");
    outputUnit = createUnit(allClass);
    grunt.log.writeln("Full array: " + "\n" + outputUnit[0]);
    outputFile += outputUnit[1].map(function(value) {
      return ".make-untilizer(" + value + ");";
    }).join("\n");

    // Create end file
    grunt.file.write(dest, outputFile);
    grunt.log.writeln('File "' + dest + '" create.');
  });
};
