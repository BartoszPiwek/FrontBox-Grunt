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

  // all class finding in html files
  var allClass = [],
    // outpur file contain less functions & responsive class
    outputFile = '',
    responsiveFile = '',
    responsiveArray = [];


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

  grunt.registerMultiTask('autoclass', 'Creat', function() {
    // Variables
    var options = this.options(),
      database = readDatabase(options.database),
      databaseKeys = Object.keys(database),
      databaseLen = databaseKeys.length,
      dest = options.dest,
      destResponsive = options.destResponsive;

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
          indexInDatabase,
          unit;

        if (addon === "responsive") {
          indexInDatabase = checkClassExist(property, responsiveArray);

          if (indexInDatabase === -1) {
            unit = objectField.unit[index + 1];
            responsiveArray.push([property, unit, value]);
            // If array exist
          } else if (responsiveArray[indexInDatabase].indexOf(value) === -1) {
            responsiveArray[indexInDatabase].push(value);
          }

            var typedata = checkType(value);
            if (typedata !== -1) {
              var field = "field" + typedata;
              if (!database[field].output) {
                database[field].output = [];
              }
              grunt.log.writeln(typedata + " " + field + " " + value);
            }


            if (indexInDatabase === -1) {
              unit = objectField.unit[index + 1];
              responsiveArray.push([property, unit, value]);
              // If array exist
            } else if (responsiveArray[indexInDatabase].indexOf(value) === -1) {
              responsiveArray[indexInDatabase].push(value);
            }
          return value;


        } else {
          indexInDatabase = checkClassExist(property, objectField.output);
          if (indexInDatabase === -1) {
            unit = objectField.unit[index + 1];
            objectField.output.push([property, unit, value]);
            // If array exist
          } else if (objectField.output[indexInDatabase].indexOf(value) === -1) {
            objectField.output[indexInDatabase].push(value);
          }
        }
      };

      var classProcess = function(name) {
        var typedata = checkType(name);
        if (typedata !== -1) {
          var field = "field" + typedata;
          if (!database[field].output) {
            database[field].output = [];
          }

          var checkInField = database[field],
            indexDash = name.indexOf(checkInField.gap),
            property = name.slice(0, indexDash),
            value = name.slice(indexDash + 1, name.length),
            addon = false;

          if (!database[field].output) {
            database[field].output = [];
          }

          // Check if have addon property - "responsive"
          if (database[field].addon === "responsive") {
            addon = addOutputValue(database[field], value, property, "responsive");
          }
          // If don't have addon property
          else {
            addon = addOutputValue(database[field], value, property);
          }

          if (addon) {
            classProcess(addon);
          }

        } else {
          return false;
        }
      };

      // Variables
      var output = [],
        len = array.length;

      // Loop
      for (var i = 0; i < len; i++) {
        classProcess(array[i]);
      }
      return output;
    };

    //===== START FUNCTION

    // Loop files
    // add all class to array "allClass"
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

    //
    var outputUnit = createUnit(allClass);

    //=========================================================================
    // Loop all array with tool classes
    //=========================================================================
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

    //=========================================================================
    // Loop all array with responsive class
    //=========================================================================

    var buildResponsive = function(array) {
      if (array.length) {
        var len = array.length,
          output = "\n";

        for (var i = 0; i < len; i++) {
          var len2 = responsiveArray[i].length - 1;

          output += "@media " + array[i][1] + " { \n";
          for (var a = len2; a > 1; a--) {
            output += "\t." + array[i][0] + "_" + array[i][a] + " { \n";
            output += "\t\t." + array[i][a] + ";\n";
            output += "\t} \n";
          }
          output += "}\n";

        }
        grunt.log.writeln('File "' + destResponsive + '" create.');
        return output;
      }
      grunt.log.writeln("Responsive class: empty");
    };

    var outputFileResponsive = buildResponsive(responsiveArray);

    //=========================================================================
    // Create end file
    //=========================================================================
    grunt.file.write(dest, outputFile);
    grunt.file.write(destResponsive, outputFileResponsive);
    grunt.log.writeln('File "' + dest + '" create.');
  });
};
