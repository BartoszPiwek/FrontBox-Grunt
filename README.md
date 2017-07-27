# FrontBox Grunt

Recommended:

> https://github.com/BartoszPiwek/FrontBox-Grunt

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install frontbox-grunt --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('frontbox-grunt');
```

## Tasks

### autocolor
Scan LESS/SASS files and automatic replace/create variable for colors.

```js
    autocolor: {
      automatic: {
        expand: true,
        src: '*.less',
        cwd: 'less/',
        flatten: true,
      },
      options: {
        variableFile: "less/variables/_colors.less",
        prefix: "@",
      }
    },
```

### Options

#### options.variableFile
Type: `String`

Path for less/sass file contain all colors variables

#### options.prefix
Type: `String`

Prefix preprocessors variable

## Release History
_1.0.2 - autocolor: convert variables name to uppercase letter; add filepath to variableFile_
<br>
_1.0.0 - add autocolor & autoclass_
