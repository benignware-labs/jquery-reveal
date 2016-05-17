module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  var
    // Read package information
    pkg = grunt.file.readJSON('package.json');
  
  grunt.initConfig({
    pkg: pkg,
    copy: {
      dist: {
        expand: true, 
        cwd: 'src/', 
        src: ['**/*'], 
        dest: 'dist/'
      }
    }, 
    // Lint definitions
    jshint: {
      all: ["src/**.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    qunit: {
      all: ['test/**/*.html']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['*.js', '!*.min.js'],
          dest: 'dist/',
          rename: function(dest, path) {
            return dest + path.replace(/\.js$/, '.min.js');
          }
        }]
      }
    }
  });
  
  grunt.registerTask('test', ['jshint', 'qunit']);
  
  grunt.registerTask('build', ['copy:dist', 'uglify:dist']);
  
  grunt.registerTask('default', ['test']);
  
};