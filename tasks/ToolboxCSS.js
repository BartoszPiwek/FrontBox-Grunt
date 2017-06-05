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

  // Global Variables
  var allClass = [],
    outputFile = '@import "automatic.less";\n';

  // Global Functions

  // Return one RegExp
  var createReg = function(object) {
    var output = "^(",
      units = object.unit,
      gap = object.gap,
      addon = object.addon;
    if (!addon) {
      addon = "";
      gap = gap + "\\d+";
    } else {
      addon = gap;
      gap = ".*?\\d+$";
    }
    output += units.map(function(value, index) {
      if (index % 2 !== 0) {
        return;
      }
      return value + addon + "|";
    }).join("");
    output += ")" + gap;

    grunt.log.writeln(output);
    return new RegExp(output);
  };

  // Return database object
  var readDatabase = function(path) {
    return grunt.file.readJSON(path);
  };

  // Return number of usage array
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
      database = readDatabase(options.database),
      databaseKeys = Object.keys(database),
      databaseLen = databaseKeys.length,
      dest = options.dest;

    //===== Functions

    // Return array with RegExp
    var regLoop = function() {
      for (var i = 0; i < databaseLen; i++) {
        var databaseName = database["field" + i];
        databaseName.regExp = createReg(databaseName);
      }
    };

    // Return database type number
    var checkType = function(className) {
      for (var i = 0; i < databaseLen; i++) {
        if (database["field" + i].regExp.test(className)) {
          return i;
        }
      }
      return -1;
    };

    // Return full array with class
    var createUnit = function(array) {
      regLoop();
      var output = [],
        len = array.length;
      for (var i = 0; i < len; i++) {
        var className = array[i],
          typedata = checkType(className);
        // Check if className match RegEx
        if (typedata !== -1) {
          // Variables
          var field = "field" + typedata,
            indexDash = className.indexOf(database[field].gap),
            property = className.slice(0, indexDash),
            value = className.slice(indexDash + 1, className.length);

          // If property dont exist in array
          if (!database[field].output) {
            database[field].output = [];
          }
          var index = database[field].unit.indexOf(property),
            indexInDatabase = checkClassExist(property, database[field].output);
          if (indexInDatabase === -1) {
            var unit = database[field].unit[index + 1];
            database[field].output.push([property, unit, value]);
            // If array exist
          } else if (database[field].output[indexInDatabase].indexOf(value) === -1) {
            database[field].output[indexInDatabase].push(value);
          }
        }
      }
      return output;
    };

    //===== START FUNCTION

    // Loop files
    this.files.forEach(function(f) {
      // Variables
      var filepath = f.src,
        content = grunt.file.read(filepath),
        $ = cheerio.load(content, {
          decodeEntities: false
        });
      $('[class]').each(function(array) {
        $($(this).attr('class').split(' ')).each(function() {
          var name = this;
          if (allClass.indexOf(name) === -1) {
            allClass.push(name);
          }
        });
      });
    });

    // Array allClass have all class in html files
    var outputUnit = createUnit(allClass);

    var printAllOutput = function() {

      // Variable
      var output = [],
        // Function
        createNewFunction = function(value, lessFunction) {
          return "." + lessFunction + "(" + value + ");";
        };

      // Loop all object "field"
      for (var i = 0; i < databaseLen; i++) {
        var dataField = database["field" + i],
          dataLess = dataField.output;
        // If have output data
        if (dataLess) {
          var lenField = dataLess.length,
            lessFunction = dataField.function;
          for (var a = 0; a < lenField; a++) {
            output.push(createNewFunction(dataLess[a], lessFunction));
          }
        }
      }
      return output.join("\n");
    };
    outputFile += printAllOutput();

    // Create end file
    grunt.file.write(dest, outputFile);
    grunt.log.writeln('File "' + dest + '" create.');
  });
};
