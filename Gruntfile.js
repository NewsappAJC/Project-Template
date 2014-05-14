module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('config/aws.json'),
    copy: {
      target: {
        files: [
          {
            expand: true,
            src: ['src/scripts/lib/jquery.min.js'],
            dest: 'build/scripts/lib/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          // {
          //   expand: true,
          //   src: ['src/scripts/lib/underscore/underscore-min.js'],
          //   dest: 'build/scripts/lib/',
          //   rename: function (dest, src) {
          //     return dest + src.substring(src.lastIndexOf('/')).replace('-min','');
          //   }
          // },
          // {
          //   expand: true,
          //   src: ['src/scripts/lib/backbone/backbone-min.js'],
          //   dest: 'build/scripts/lib/',
          //   rename: function (dest, src) {
          //     return dest + src.substring(src.lastIndexOf('/')).replace('-min','');
          //   }
          // },
          // {
          //   expand: true,
          //   src: ['src/scripts/lib/d3/d3.min.js'],
          //   dest: 'build/scripts/lib/',
          //   rename: function (dest, src) {
          //     return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
          //   }
          // },
          // {
          //   expand: true,
          //   src: ['src/scripts/lib/d3bb/build/d3bb.min.js'],
          //   dest: 'build/scripts/lib/',
          //   rename: function (dest, src) {
          //     return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
          //   }
          // },
          { expand: true, flatten: true, src: ['src/scripts/lib/underscore.js'], dest: 'build/scripts/lib/' },
          { expand: true, flatten: true, src: ['src/scripts/lib/flatpage_stubs.js'], dest: 'build/scripts/lib/' },
        ]
      }
    },

    jshint: {
      files: [
        'src/scripts/*.js'
      ],
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        latedef: true,
        undef: true,
        unused: true,
        trailing: true,
        smarttabs: true,
        indent: 2,
        globals: {
          jQuery: true,
          $: true,
          _: true
        }
      }
    },

    uglify: {
      options: {
        mangle: { except: ['d3', '_','$'] },
        compress: true,
        report: 'gzip'
      },
      my_target: {
        files: {
          'build/scripts/main.js'   : ['src/scripts/main.js']
        }
      }
    },

    processhtml: {
      options: {
        process: true,
        strip: true
      },
      build: {
        files: {
          'tmp/index.html': ['src/index.html']
        }
      }
    },

    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapsWhitespace: true,
          useShortDoctype: true
        },
        files: {
          'build/index.html'    : 'tmp/index.html'
        }
      }
    },

    cssmin: {
      compress: {
        options: {
          report: 'gzip'
        },
        files: {
          'build/style/app.css': ['src/style/app.css'],
          'build/style/skeleton.css': ['src/style/skeleton.css']
        }
      }
    },

    imagemin: {
      jpg: {
        options: { progressive: true },
        files: [{
          expand: true,
          cwd: "src/images",
          src: ["*.jpg"],
          dest: "build/images"
        }]
      }
    },

    s3: {
      key: "<%= aws.key %>",
      secret: "<%= aws.secret %>",
      bucket: "<%= aws.bucket %>",
      access: "public-read",
      gzip: true,
      gzipExclude: [".jpg",".png"],
      debug: false,
      upload: [
        { src: 'build/*.html', dest: '.' },
        { src: 'build/scripts/*', dest: 'scripts/' },
        { src: 'build/scripts/lib/*', dest: 'scripts/lib/' },
        { src: 'build/style/*', dest: 'style/' }
      ]
    },

    bowercopy: {
      options: {
        // clean: true,
        runBower: true,
        report: true
      },
      test: {
        options: {
          destPrefix: 'test'
        },
        files: {
          "boot.js": "jasmine/lib/jasmine-core/boot.js",
          "console.js": "jasmine/lib/console/console.js",
          "jasmine-html.js": "jasmine/lib/jasmine-core/jasmine-html.js",
          "jasmine.css": "jasmine/lib/jasmine-core/jasmine.css",
          "jasmine.js": "jasmine/lib/jasmine-core/jasmine.js",
          "jasmine_favicon.png": "jasmine/images/jasmine_favicon.png",
          "sinon.js": "sinon/lib/sinon.js"
        }
      },
      lib: {
        options: {
          destPrefix: 'src/scripts/lib'
        },
        files: {
          "jquery.js": "jquery/dist/jquery.js",
          "jquery.min.js": "jquery/dist/jquery.min.js",
          "underscore.js": "underscore/underscore.js"
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-bowercopy');


  grunt.registerTask('default', ['copy','uglify','cssmin','processhtml', 'htmlmin','s3']);
  grunt.registerTask('build', ['copy','uglify','cssmin','processhtml', 'htmlmin']);
  grunt.registerTask('deploy', ['s3']);
  grunt.registerTask('lint', ['jshint']);
};

