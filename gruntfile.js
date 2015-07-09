module.exports = function(grunt) {




	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		cordovacli: {
			cordova: {
				options: {
					command: ['platform', 'build'],
					platforms: ['android'],
					plugins: ['cordova-plugin-crosswalk-webview'],
					path: 'cordova'
				}
			}
		},
		copy: {
			main: {
				files: [
					{src: ['cordova/platforms/android/build/outputs/apk/android-armv7-debug.apk'], dest: 'C:\\Users\\Javier\\Desktop\\Shared_Folder\\calculateRoute.apk'},
					{src: ['cordova/platforms/android/build/outputs/apk/android-armv7-debug.apk'], dest: 'C:\\Users\\Javier\\Dropbox\\calculateRoute.apk'}
				],
			},
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: ['app/client/*[!lib]*/*.css']
			},
		},
		watch: {
			options: {
				livereload: true
			},
			app: {
				files:['app/**'],
				tasks: ['express:desarrollo'],
				options: {
					spawn: false
				}
			}
		},
		express: {
			desarrollo: {
				options: {
					script: 'server.js --color'
				}
			},
			produccion: {
				options: {
					script: 'server.js --color',
					node_env: 'production'
				}
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-csslint');

	grunt.loadNpmTasks('grunt-cordovacli');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');

	grunt.registerTask('default', ['cordovacli', 'copy', 'csslint', 'express:desarrollo', 'watch:app']);


};