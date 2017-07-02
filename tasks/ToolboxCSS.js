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
    return false;
  };

  grunt.registerMultiTask('toolboxcss', 'Creat', function() {
    // Variables
    var options = this.options(),
      database = readDatabase(options.database),
      databaseKeys = Object.keys(database),
      databaseLen = databaseKeys.length,
      dest = options.dest;

    //===== Functions

    // Return field key
    var fieldName = function(fieldNumber) {
      return "field" + fieldNumber;
    };

    // Return array with RegExp
    var regLoop = function() {
      for (var i = 0; i < databaseLen; i++) {
        var databaseName = database[fieldName(i)];
        databaseName.regExp = createReg(databaseName);
      }
    };

    // Return property 2 ( index className + 1 )
    var checkProperty2 = function(array, className) {
      var index = array.indexOf(className);
      return array[index + 1];
    };

    // Return class field number
    var checkTypeClass = function(className) {
      for (var i = 0; i < databaseLen; i++) {
        if (database[fieldName(i)].regExp.test(className)) {
          return i;
        }
      }
      return false;
    };

    // Return full array with class
    var createUnit = function(array) {

      // Run Functions
      regLoop();

      // Functions
      var checkOutputValue = function(className, field, outField) {

        var addOutputValue = function(objectField, value, property, addon) {
          var index = objectField.unit.indexOf(property),
              indexInDatabase = checkClassExist(property, objectField.output);
          if (addon === "responsive") {

            // Create new class for responsive class
            grunt.log.writeln("PROP:" + value);
            var typedata = checkTypeClass(value);
            if (typedata !== false) {
              var field2 = fieldName(typedata);
              if (!database[field].output) {
                database[field].output = [];
              }
              grunt.log.writeln("Create class for responsive: " + value);
                field2 = fieldName(typedata);
                var foo = checkOutputValue(value, field2, "return");
              grunt.log.writeln("RETURN : " + foo);
            }

            objectField.output.push([property, foo[0], foo[1], foo[2]]);
            grunt.log.writeln("RESPONSIVE {");
          } else {
            if (indexInDatabase === false && addon !== "return") {
              var unit = objectField.unit[index + 1];
              grunt.log.writeln("1");
              objectField.output.push([property, unit, value]);
              // If value don't exist in array
            } else if (checkClassExist(objectField.output[indexInDatabase], value) === false && addon !== "return") {
              objectField.output[indexInDatabase].push(value);
            } else {
              var unit = objectField.unit[index + 1];
              grunt.log.writeln("RETURN");
              grunt.log.writeln(property, unit, value);
              return [property, unit, value];
            }
          }
          grunt.log.writeln("Index:" + index + "\nIndexInDatabase: " + indexInDatabase + "\nValue: " + value + "\nProperty: " + property);
          if (addon === "responsive") {
            grunt.log.writeln("}\n");
          } else {
            grunt.log.writeln("\n");
          }
        };


        if (!outField) {
          outField = field;
        }
        var checkInField = database[field],
            indexDash = className.indexOf(checkInField.gap),
            property = className.slice(0, indexDash),
            value = className.slice(indexDash + 1, className.length);

        // Check if have addon property - "responsive"
        if (database[field].addon === "responsive") {
          addOutputValue(database[field], value, property, "responsive");
        } else if (outField === "return") {
          return addOutputValue(database[field], value, property, "return");
        }
        // If don't have addon property
        else {
          addOutputValue(database[outField], value, property);
        }
      };

      // Variables
      var output = [],
        len = array.length;

      // Loop
      for (var i = 0; i < len; i++) {
        var className = array[i];
        var typedata = checkTypeClass(className);
        if (typedata !== false) {
          var field = fieldName(typedata);
          if (!database[field].output) {
            database[field].output = [];
          }
          checkOutputValue(className, field);
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
        var dataField = database[fieldName(i)],
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
