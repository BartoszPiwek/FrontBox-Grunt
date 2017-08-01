<p align="center">
  <img src="/gitfiles/grunt-logo.png" width="200" height="200" alt="Grunt Logo"/>
</p>

# FrontBox Grunt

Strong integrate with:

> https://github.com/BartoszPiwek/FrontBox-Grunt

Bunch of useful grunt tasks for Front-End Developer
```
Author: Bartosz Piwek
Version: 1.0.4
```

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install frontbox-grunt --save-dev
```

## Task: autocolor

Scan LESS/SASS files and automatic replace/create variable for colors.

```js
    autocolor: {
      automatic: {
        expand: true,
        src: '**',
        cwd: 'less/',
        filter: 'isFile'
      },
      options: {
        variableFile: "less/variables/_colors.less",
        prefix: "@",
      }
    },
```

```js
    grunt.registerTask('color', ['autocolor']);
```

### Options

#### options.variableFile
Type: `String`

Path for less/sass file contain all colors variables

#### options.prefix
Type: `String`

Preprocessors variable prefix

### Preview
<p align="center">
  <img src="/gitfiles/autocolor.gif" width="400" alt="Task: autocolor"/>
</p>

## Bugs and development
>
- Feel free
> https://github.com/BartoszPiwek/FrontBox-Grunt/issues

## Release History
_1.0.4 - autocolor: fix match character size_
<br>
_1.0.3 - autocolor: fix ignore variableFile_
<br>
_1.0.2 - autocolor: convert variables name to uppercase letter; add filepath to variableFile_
<br>
_1.0.0 - add autocolor & autoclass_
