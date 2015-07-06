
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular.element(document).ready(function() {
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});