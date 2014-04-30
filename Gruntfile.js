module.exports = function (grunt) {
    "use strict";

    var SRC_FILES = "src/**/*.js";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jsdoc: {
            dist: {
                src: [SRC_FILES],
                options: {
                    destination: "doc",
                }
            }
        },
        jshint: {
            all: ["Gruntfile.js", SRC_FILES],
            options: {
                browser: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                globals: {
                    define: true,
                    module: true,
                    require: true,
                    THREE: true,
                },
                indent: 4,
                noarg: true,
                strict: true,
                trailing: true,
                undef: true,
                unused: true,
            }
        },
        browserify: {
            dist: {
                files: {
                    "dist/graphosaurus.js": "src/**/*.js",
                },
            }
        },
        uglify: {
            dist: {
                files: {
                    "dist/graphosaurus.min.js": "dist/graphosaurus.js"
                }
            }
        },
        watch: {
            files: ["Gruntfile.js", SRC_FILES],
            tasks: "default",
        }
    });

    // Load plugins
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-jsdoc");

    // Tasks
    grunt.registerTask("default", ["compile", "doc"]);

    grunt.registerTask("compile", ["jshint", "browserify", "uglify"]);
    grunt.registerTask("doc", ["jsdoc"]);
};
