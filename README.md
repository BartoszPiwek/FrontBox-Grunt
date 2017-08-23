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

Scan CSS Preprocessor files (LESS/SASS) and automatically replace/create variable for colors.

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

CSS Preprocessors variable prefix.
```less
  @variable: 16px;
```
```sass
  $variable: 16px;
```

### Preview
<p align="center">
  <img src="/gitfiles/autocolor.gif" width="400" alt="Task: autocolor"/>
</p>

## Task: autosvg

Automatically insert inline SVG in files (like HTML/PHP)

```js
  autosvg: {
    automatic: {
      expand: true,
      src: ['*.html', "*.php"],
      cwd: 'template/',
      flatten: true,
    },
    options: {
      output_directory: "public/",
      svg_directory: "svg/",
      debug_log: true,
    }
  },
```

```js
    grunt.registerTask('svg', ['autosvg']);
```

### Usage

Place svg filename (without .svg) in HTML template comment block:
{icon_name} - this is where you place your icon filename

```html
  <!-- icon-{icon_name} -->
```

Example: You want place icon 'arrow-left.svg' in document. Your comment block will be looks:

```html
  <!-- icon-arrow-left -->
```

### Options

#### options.output_directory
Type: `String`

Path directory for output files.

#### options.svg_directory
Type: `String`

Path for svg directory files.

#### options.debug_log
Type: `Bool` Default value: 'false'

Show expanded log.

### Preview
<p align="center">
  <img src="/gitfiles/autosvg.gif" width="400" alt="Task: autosvg"/>
</p>


## Bugs and development
>
- Feel free
> https://github.com/BartoszPiwek/FrontBox-Grunt/issues

## Release History
_1.0.41 - add autosvg (no publish)_
<br>
_1.0.4 - autocolor: fix match character size_
<br>
_1.0.3 - autocolor: fix ignore variableFile_
<br>
_1.0.2 - autocolor: convert variables name to uppercase letter; add filepath to variableFile_
<br>
_1.0.0 - add autocolor & autoclass_
