/*
 * Automatic insert meta for SEO
 * https://github.com/BartoszPiwek/FrontBox-Grunt
 *
 * Copyright (c) 2017 Bartosz Piwek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('autometaseo', 'Creat', function() {

    // Return database file
    var return_file_content = function(path) {
      return grunt.file.read(path);
    };

    // Variables
    var options = this.options(),

    twitter_account = options.twitter_account,
    website_name = options.website_name,
    website_image = options.website_image,
    website_locale = options.website_locale,
    website_link = options.website_link,
    rename_url = options.rename_url,
    debug = options.debug;

    var reg_description = /(?:<meta )(?:.*name="description")(?:.*content=")(.*)(?:")(?:>)/g,
        reg_title = /(?:<title>)(.*)(?:<\/title>)/g;

    var match, success;

    var site = {
      description: "",
      title: "",
      image: "",
    };

    // Loop files
    this.files.forEach(function(f) {
      var filepath = f.src[0],
          file_content = return_file_content(filepath);
      
      site.description = reg_description.exec(file_content)[1];
      site.title = reg_title.exec(file_content)[1];

      grunt.log.writeln(description, title);
      
    });

    // End log
    if (success) {
      grunt.log.ok("Inserted meta for SEO");
    } else {
      grunt.log.error("Problem with task. Add debug:true to gruntfile.js and check what is wrong");
    }
  });
};
