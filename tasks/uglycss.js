// /*
//  * Color to CSS Preprocessors
//  * https://github.com/BartoszPiwek/FrontBox-Grunt
//  *
//  * Copyright (c) 2017 Bartosz Piwek
//  * Licensed under the MIT license.
//  */
//
// 'use strict';
//
// module.exports = function(grunt) {
//
// grunt.registerMultiTask('autocolor', 'Creat', function() {
//
//       // Return database file
//       var readFile = function(path) {
//         return grunt.file.read(path);
//       };
//
//       // Main variables
//       var options = this.options(),
//         // Main CSS content
//         fileCSSMain = readFile(options.maincss),
//         objectCSSMain = {},
//         // Ignore CSS class
//         ignoreClass = options.ignoreClass,
//         // Ignore CSS id
//         ignoreID = options.ignoreID,
//         // REGEXP
//         // select class
//         // if begin with dot and end with white space or dot or hash
//         selectClass = /\w(.?)(\w/||.||#) / ,
//         // if begin with hash and end with white space or dot or hash
//         selectID = /\w(#).?(\w/||.|| #)/,
//
//         // TEMP VAR
//         match,
//         temp,
//         temp2;
//
// // Fill object with class/id in "fileCSSMain" file
// while (match = selectClass.exec(fileCSSMain) || match = selectID.exec(fileCSSMain)) {
//   temp = match[1];
//   temp2 = "id";
//   if (temp[0] === ".") {
//     temp2 = "class";
//   }
//   temp = temp.slice(1, temp.length);
//   objectCSSMain[temp2].push[temp];
// }
//
// // Loop files
// this.files.forEach(function(f) {
//   var filepath = f.src[0];
//
//   //
//   if (filepath !== dest) {
//     // Variables
//     var content = grunt.file.read(filepath);
//
//     while (match = regHex.exec(content)) {
//       if (regIsHex.test(match)) {
//         match = match[0];
//         temp = new RegExp(match);
//         match = match.toUpperCase();
//         temp2 = colorsObject[match];
//         if (temp2 !== void 0 && temp2 !== varName) {
//           content = content.replace(temp, temp2);
//         } else if (temp2 !== varName) {
//           colorsObject[match] = varName;
//           destContent += "// " + varName + ": " + match + "; // " + filepath + "\n";
//         } else {
//           unSetVar = true;
//         }
//         countNewVar++;
//       }
//     }
//     grunt.file.write("" + filepath, content);
//   }
// });
//
// //=========================================================================
// // Create end file
// //=========================================================================
//
// // Set log information count
// // temp = grunt.util.pluralize(countNewVar, "variable/variables");
// // console.log(countNewVar);
// // // Print end message
// // if (readFile(options.variableFile) !== destContent) {
// //   grunt.file.write(dest, destContent);
// //   grunt.log.error('Check ' + dest + " file and rename new " + temp);
// //   grunt.log.error('After that run task again');
// // } else if (unSetVar) {
// //   grunt.log.error('Check file ' + dest + " and rename created " + temp);
// // } else {
// //   grunt.log.ok('Everything is perfect :)');
// // }
// });
// };
