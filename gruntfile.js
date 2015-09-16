module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		cordovacli: {
			cordova: {
				options: {
					command: ['platform', 'plugin', 'build'],
					platforms: ['android'],
					plugins: ['cordova-plugin-geolocation', 'cordova-plugin-crosswalk-webview'],
					//plugins: ['cordova-plugin-geolocation'],
					path: 'cordova'
				}
			}
		},
		copy: {
			main: {
				files: [
					//{src: ['cordova/platforms/android/build/outputs/apk/android-debug.apk'], dest: 'C:\\Users\\Javier\\Desktop\\Shared_Folder\\calculateRoute.apk'},
                    {src: ['cordova/platforms/android/build/outputs/apk/android-armv7-debug.apk'], dest: 'C:\\Users\\Javier\\Desktop\\Shared_Folder\\calculateRoute.apk'},
                    //{src: ['cordova/platforms/android/build/outputs/apk/android-debug.apk'], dest: 'C:\\Users\\Javier\\Dropbox\\calculateRoute.apk'}
                    {src: ['cordova/platforms/android/build/outputs/apk/android-armv7-debug.apk'], dest: 'C:\\Users\\Javier\\Dropbox\\calculateRoute.apk'}
				],
			},
		}
	});

	grunt.loadNpmTasks('grunt-cordovacli');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['cordovacli', 'copy']);
};