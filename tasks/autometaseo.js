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

    var imageSize = require('image-size');

    // Variables
    var options = this.options(),

    twitter_account = options.twitter_account,
    website_name = options.website_name,
    image_dir = options.image_dir,
    image_format = options.image_format,
    website_locale = options.website_locale,
    website_link = options.website_link,
    website_url = options.website_url,
    website_dir = options.website_dir,
    rename_url = options.rename_url,
    debug = options.debug;

    var reg_description = /(?:<meta )(?:.*name="description")(?:.*content=")(.*)(?:")(?:>)/g,
        reg_title = /(?:<title>)(.*)(?:<\/title>)/g;

    var match, success, temp;
    
    var site = {
      description: "",
      title: "",
      place: "",
      image: "",
      image_width: "",
      image_height: "",
    };

    var meta_function = function(url, title, twitter_accout, image, name, description, locale, img_width, img_height){
      var meta_html = [
        '\n<!-- Meta OG -->',
        '<meta property="og:type" content="website">',
        '<meta property="og:title" content="' + title + '">',
        '<meta property="og:image" content="' + website_url + image + '">',
        '<meta property="og:description" content="' + description + '">',
        '<meta property="og:site_name" content="' + name + '">',
        '<meta property="og:locale" content="' + locale + '">',
        '<meta property="og:image:width" content="' + img_width + '">',
        '<meta property="og:image:height" content="' + img_height + '">',
        '<!-- Meta Twitter -->',
        '<meta name="twitter:url" content="' + website_url + "/" + url + '">',
        '<meta name="twitter:title" content="' + title + '">',
        '<meta name="twitter:card" content="summary">',
        '<meta name="twitter:site" content="' + twitter_account + '">',
        '<meta name="twitter:image" content="' + website_url + image + '">',
      ];
      return meta_html.join("\n");
    };

    // Loop files
    this.files.forEach(function(f) {
      var filepath = f.src[0],
          filename = f.dest,
          filename2 = filename.replace(".html", ""),
          dest_file = f.orig.cwd,
          file_content = return_file_content(filepath),
          meta_html; 
      
      temp = reg_description.exec(file_content);
      site.description = temp[1];
      site.place = temp[0];
      site.title = reg_title.exec(file_content)[1];

      site.image = "/" + image_dir + "/" + filename2 + "." + image_format;

      var page_image_size = imageSize(website_dir + site.image);

      site.image_height = page_image_size.height;
      site.image_width = page_image_size.width;

      meta_html = meta_function(
        filename,
        site.title,
        twitter_account,
        site.image,
        website_name,
        site.description,
        website_locale,
        site.image_width,
        site.image_height
      );
      
      file_content = file_content.replace(site.place, site.place + meta_html);
      grunt.file.write(dest_file + "/output.html", file_content);
    });

    // End log
    grunt.log.ok("Inserted meta for SEO");
  });
};
