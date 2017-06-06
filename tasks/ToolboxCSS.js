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
      endReg = object.endReg,
      addon = object.addon;
    output += units.map(function(value, index) {
      if (index % 2 !== 0) {
        return;
      }
      return value + "|";
    }).join("");
    output += ")" + gap + endReg;

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

      // Run Functions
      regLoop();

      // Functions
      var addOutputValue = function(objectField, value, property, addon) {
        var index = objectField.unit.indexOf(property),
          indexInDatabase = checkClassExist(property, objectField.output);
          if (addon === "responsive") {
            grunt.log.writeln("RESPONSIVE");
          } else {
          grunt.log.writeln("Index:" + index +"\nIndexInDatabase: " + indexInDatabase + "\nValue: " + value + "\nProperty: "+property+"\n");
        if (indexInDatabase === -1) {
          var unit = objectField.unit[index + 1];
          objectField.output.push([property, unit, value]);
          // If array exist
        } else if (objectField.output[indexInDatabase].indexOf(value) === -1) {
          objectField.output[indexInDatabase].push(value);
        }
      }
      };

      var checkOutputValue = function(className, field, outField) {
        if (!outField) {
          outField = field;
        }
        var checkInField = database[field],
            indexDash = className.indexOf(checkInField.gap),
            property = className.slice(0, indexDash),
            value = className.slice(indexDash + 1, className.length);

        if (!database[field].output) {
          database[field].output = [];
        }

        // Check if have addon property - "responsive"
        if (database[field].addon === "responsive") {
          addOutputValue(database[field], value, property, "responsive");
        }
        // If don't have addon property
        else {
          addOutputValue(database[field], value, property);
        }
      };

      // Variables
      var output = [],
          len = array.length;

      // Loop
      for (var i = 0; i < len; i++) {
        var typedata = checkType(array[i]);
        if (typedata !== -1) {
          var field = "field" + typedata;
          if (!database[field].output) {
            database[field].output = [];
          }
          checkOutputValue(array[i], field);
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
