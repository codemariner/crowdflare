'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    express: {
       dev: {
         options: {
           script: 'src/server/crowdflare.js'
         }
       }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['src/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib']
      },
      express: {
        files: [ 'src/server/**/*.js'],
        tasks: [ 'express:dev' ],
        options: {
          nospawn: true
        }
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  // Default task.
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('server', ['express:dev', 'watch']);

};
