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
        requirejs: {
            compileWithoutThree: {
                options: {
                    baseUrl: ".",
                    name: "build/almond/almond",
                    include: ["src/graphosaurus"],
                    out: "dist/graphosaurus.no-three.min.js",
                    preserveLicenseComments: false,
                    wrap: {
                        startFile: "build/start.frag.js",
                        endFile: "build/end.frag.js",
                    }
                }
            },
            compileWithThree: {
                options: {
                    baseUrl: ".",
                    name: "build/almond/almond",
                    include: ["src/graphosaurus"],
                    out: "dist/graphosaurus.min.js",
                    preserveLicenseComments: false,
                    wrap: {
                        startFile: ["build/start.frag.js", "build/three-r66.min.js"],
                        endFile: "build/end.frag.js",
                    }
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
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-jsdoc");

    // Tasks
    grunt.registerTask("default", ["compile", "doc"]);

    grunt.registerTask("compile", ["jshint", "requirejs"]);
    grunt.registerTask("doc", ["jsdoc"]);
};
