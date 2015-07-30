/**
 * This PTV xServer client object wraps http requests to a PTV xServer service with easy to use functions.
 * @constructor
 * @param {string} [requestURL] The base URL of the service to use, before the /rs/ part. If omitted, the origin of this script will be used.
 * @param {number} [activeRequestLimit] The maximum number of concurrent active http requests. If omitted or zero, the number of requests is unlimited.
 */
/* exported XRouteClient */
/* jshint -W099, -W031, -W069, bitwise:false */
function XRouteClient(requestURL, activeRequestLimit) {
	'use strict';
	
	if (typeof activeRequestLimit !== "number" || activeRequestLimit <= 0) {
        activeRequestLimit = Number.MAX_VALUE;
    }

	requestURL = findRequestURL(requestURL);

	var activateCORS = isCrossDomain(),
		sendRequest = selectSendMethod(),
		requestHeader = { "Content-Type": "application/json;charset=UTF-8" },
		activeRequestCount = 0,
		requestQueue = [],
		client = this,
		toBase64 = (typeof window.btoa === "function") ? window.btoa : function (input) {
			var out = "",
				end = input.length - 2,
				i = 0,
				BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
				c, d, e;
			while (i < end) {
				c = input.charCodeAt(i++);
				d = input.charCodeAt(i++);
				e = input.charCodeAt(i++);
				out += BASE64.charAt(c >> 2) + BASE64.charAt(((c & 3) << 4) | (d >> 4)) + 
					BASE64.charAt(((d & 15) << 2) | (e >> 6)) + BASE64.charAt(e & 63);
			}
			if (i === end) {
				c = input.charCodeAt(i++);
				d = input.charCodeAt(i);
				out += BASE64.charAt(c >> 2) + BASE64.charAt(((c & 3) << 4) | (d >> 4)) + BASE64.charAt((d & 15) << 2) + "=";
			} else if (i === end + 1) {
				c = input.charCodeAt(i);
				out += BASE64.charAt(c >> 2) + BASE64.charAt(((c & 3) << 4)) + "==";
			}
			return out;
		};

	function findRequestURL(requestURL) {
		if (typeof requestURL !== "string") {
			var scripts = document.getElementsByTagName("script");
			for (var i = scripts.length - 1; i >= 0; i--) {
				if (scripts[i].src) {
					var urlParts = scripts[i].src.match(/(.*\/|)([^\/\.]*)/);
					if (urlParts[2] === "xroute-client") {
						requestURL = urlParts[1];
						break;
					}
				}
			}
		} else {
			if (requestURL && requestURL.charAt(requestURL.length - 1) !== "/") {
				requestURL += "/";
			}
		}
		if (typeof requestURL !== "string") {
			throw new Error("Could not retrieve origin URL.");
		}
		return requestURL + "rs/XRoute/";
	}
	
	function isCrossDomain() {
		var o = window.location;
		var a = document.createElement("a");
		a.href = requestURL;
		return (a.protocol === "http:" || a.protocol === "https:") && 
			(o.protocol !== a.protocol || o.port !== a.port || (o.hostname !== a.hostname && document.domain !== a.hostname));
	}

	function selectSendMethod() {
		var hasXMLHttpRequest = (typeof XMLHttpRequest !== "undefined");
		if (activateCORS) {
			if (hasXMLHttpRequest) {
				if ("withCredentials" in new XMLHttpRequest()) {
					return sendXMLHttpRequest;
				} else if (typeof window.XDomainRequest !== "undefined") {
					return sendXDomainRequest;
				}
			}
			throw new Error("This browser does not support CORS.");
		} else {
			if (!hasXMLHttpRequest) {
				try {
					new window.ActiveXObject("Microsoft.XMLHTTP");
				} catch (ex) {
					throw new Error("This browser does not support Ajax.");
				}
			}
			return sendXMLHttpRequest;
		}
	}
	
	function sendXMLHttpRequest(path, request, callbackHandler, timeout) {
        var async = ( typeof callbackHandler === "function"), xhr;
        if (async && activeRequestCount >= activeRequestLimit) {
            requestQueue.push({ path: path, request: request, callbackHandler: callbackHandler, timeout: timeout });
            return null;
        }
        xhr = (typeof XMLHttpRequest !== "undefined") ? new XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP");
        xhr.open("POST", requestURL + path, async);
        for (var fieldName in requestHeader) {
			if (requestHeader.hasOwnProperty(fieldName)) {
				xhr.setRequestHeader(fieldName, requestHeader[fieldName]);
			}
        }
        if (async) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    var responseObject = xhr.responseText && JSON.parse(xhr.responseText);
                    if (xhr.status === 200) {
                        callbackHandler(responseObject, null, xhr);
                    } else {
                        callbackHandler(null, responseObject, xhr);
                    }
                    responseArrived();
                }
            };
            if (timeout) {
                xhr.timeout = timeout;
                xhr.ontimeout = function() {
                    callbackHandler(null, null, xhr);
                    responseArrived();
                };
            }
            xhr.send(JSON.stringify(request));
            activeRequestCount++;
            return xhr;
        } else {
            xhr.send(JSON.stringify(request));
            var responseObject = xhr.responseText && JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                return responseObject;
            } else {
                throw responseObject;
            }
        }
    }

	function sendXDomainRequest(path, request, callbackHandler, timeout) {
        if (typeof callbackHandler !== "function") {
            throw new Error("This browser does not support CORS with synchroneous requests.");
        }
        if (activeRequestCount >= activeRequestLimit) {
            requestQueue.push({ path: path, request: request, callbackHandler: callbackHandler, timeout: timeout });
            return null;
        }
        var xhr = new window.XDomainRequest();
        xhr.open("POST", requestURL + path);
        xhr.onload = function() {
            var responseObject = xhr.responseText && JSON.parse(xhr.responseText);
            callbackHandler(responseObject, null, xhr);
            responseArrived();
        };
        xhr.onerror = function() {
            var responseObject = xhr.responseText && JSON.parse(xhr.responseText);
            callbackHandler(null, responseObject, xhr);
            responseArrived();
        };
        if (timeout) {
            xhr.timeout = timeout;
            xhr.ontimeout = function() {
                callbackHandler(null, null, xhr);
                responseArrived();
            };
        }
        xhr.send(JSON.stringify(request));
        activeRequestCount++;
        return xhr;
    }
	
	function responseArrived() {
        var pendingRequest;
        activeRequestCount--;
        if (activeRequestCount < activeRequestLimit && requestQueue.length) {
            pendingRequest = requestQueue.shift();
            sendRequest(pendingRequest.path, pendingRequest.request, pendingRequest.callbackHandler, pendingRequest.timeout);
        }
    }

	/**
	 * Returns the number of currently active http requests.
	 * @returns {number}
	 */
	this.getActiveRequestCount = function () {
        return activeRequestCount;
    };

	/**
	 * Returns the current limit for the number of active http requests.
	 * @returns {number}
	 */
	this.getActiveRequestLimit = function () {
        return activeRequestLimit;
    };

	/**
	 * Sets the current limit for the number of active http requests.
	 * @param {number} [limit] The maximum number of active http requests to send. A non-positive or omitted number sets the limit to unrestricted.
	 */
	this.setActiveRequestLimit = function (limit) {
        activeRequestLimit = (typeof limit === "number" && limit >= 1) ? Math.floor(limit) : Number.MAX_VALUE;
    };

	/**
	 * Returns the number of http requests that are queued because they would have exceeded the request limit.
	 * @returns {number}
	 */
    this.getPendingRequestCount = function () {
        return requestQueue.length;
    };

	/**
	 * Clears the queue of pending http requests, preventing them from being fired.
	 */
    this.cancelPendingRequests = function () {
        requestQueue.length = 0;
    };

	/**
	 * Sets a http request header field.
	 * @param {string} fieldName the name of the request header field to set.
	 * @param {string} fieldValue the value for the request header field.
	 * @throws {Error} if a CORS request would be needed for an older IE browser.
	 */
	this.setRequestHeader = function (fieldName, fieldValue) {
		if (sendRequest === sendXDomainRequest) {
			throw new Error("This browser does not support CORS with custom request headers.");
		}
		requestHeader[fieldName] = fieldValue;
	};
	
	/**
	 * Returns the current value of a http request header field.
	 * @param {string} fieldName the name of the request header field.
	 * @returns {string} the value of the request header field, or undefined.
	 */
	this.getRequestHeader = function (fieldName) {
		return requestHeader[fieldName];
	};
	
	/**
	 * Sets the http request credentials (user, password) to be used. Set to null to deactivate authentication.
	 * @param {string} user the user name.
	 * @param {string} passwd the password.
	 * @throws {Error} if a CORS request would be needed for an older IE browser.
	 */
	this.setCredentials = function (user, passwd) {
		if (user || passwd) {
		    if (sendRequest === sendXDomainRequest) {
				throw new Error("This browser does not support CORS with basic authentication.");
			}
			/* 
				We set the base authentication header manually and avoid setting withCredentials.
				This has the very decisive advantage that it actually works with current browsers.
				if (activateCORS) xhr.withCredentials = true;
			*/
			requestHeader["Authorization"] =  "Basic " + toBase64(user + ":" + passwd);
		} else {
			delete requestHeader["Authorization"];
		}
	};

	/**
	 * Returns the service URL the requests will be sent to after attaching the method name.
	 * @returns {string}
	 */
	this.getRequestURL = function () {
        return requestURL;
    };

	/**
	 * The CallerContext object that will be used as default. Comes with an empty properties array.
	 */
	this.callerContext = { properties: [] };

	/*
	 * Generic job runner.
	 */
	function runJob(startFunction, startFunctionParameters, fetchFunction, onResult, watchOptions, onUpdate, retryOptions) {
		if (typeof onResult !== "function") {
			throw new Error("Result callback required");
		}
		if (typeof retryOptions !== "object") {
			retryOptions = {};
		}
		if (typeof retryOptions.retries !== "number") {
			retryOptions.retries = 3;
		}
		if (typeof retryOptions.retryInterval !== "number") {
			retryOptions.retryInterval = 1000;
		}
		if (typeof retryOptions.retryStatusCodes !== "object") {
			retryOptions.retryStatusCodes = [0, 502, 503, 504];
		}

		var tries = 0,
			lastKnownJob = null;

		startFunctionParameters.push(onStarted);

		function onStarted(job, err, xhr) {
			if (job === null) {
				onResult(null, err, xhr);
			} else {
				lastKnownJob = job;
				client.watchJob(job.id, watchOptions, null, statusAvailable);
			}
		}

		function statusAvailable(job, err, xhr) {
			if (job !== null) {
				tries = 0;
				lastKnownJob = job;
				if (typeof onUpdate === "function") {
					onUpdate(job, null, xhr);
				}
				if (job.status === "QUEUING" || job.status === "RUNNING" || job.status === "STOPPING") {
					client.watchJob(job.id, watchOptions, null, statusAvailable);
				} else {
					fetchFunction(job.id, null, resultAvailable);
				}
			} else {
				if (tries < retryOptions.retries && isPotentiallyRecoverable(err, xhr)) {
					tries++;
					if (typeof onUpdate === "function") {
						onUpdate(null, err, xhr);
					}
					setTimeout(function () {
						client.watchJob(lastKnownJob.id, watchOptions, null, statusAvailable);
					}, retryOptions.retryInterval);
				} else {
					onResult(null, err, xhr);
				}
			}
		}

		function resultAvailable(res, err, xhr) {
			if (res !== null) {
				onResult(res, null, xhr);
			} else {
				if (tries < retryOptions.retries && isPotentiallyRecoverable(err, xhr)) {
					tries++;
					if (typeof onUpdate === "function") {
						onUpdate(null, err, xhr);
					}
					setTimeout(function () {
						fetchFunction(lastKnownJob.id, null, resultAvailable);
					}, retryOptions.retryInterval);
				} else {
					onResult(null, err, xhr);
				}
			}
		}

		function isPotentiallyRecoverable(err, xhr) {
			if (err === null) {
				return true;
			}
			if (xhr && retryOptions.retryStatusCodes) {
				for (var i = 0; i < retryOptions.retryStatusCodes.length; i++) {
					if (retryOptions.retryStatusCodes[i] === xhr.status) {
						return true;
					}
				}
			}
			return false;
		}

		return startFunction.apply(client, startFunctionParameters);
	}

	/**
	 * The response handler that is called when a http request has returned.
	 * @callback ResponseCallback
	 * @param {object} response the response object, or null if there was an error or timeout.
	 * @param {object} exception the exception object, or null if there was no problem or a client timeout. In case of a client timeout, both response and exception are null.
	 * @param {object} xhr the XMLHttpRequest object used for the request.
	 */

	/**
	 * Options for the retry behavior of the job runner functions. All properties including the object itself are optional.
	 * @typedef {object} RetryOptions
	 * @property {number} [retries] - the maximum number of retries to attempt after failed watch or fetch requests. Will be reset after recovery. Default is 3.
	 * @property {number} [retryInterval] - the waiting period in ms before the next retry attempt. Default is 1000.
	 * @property {number[]} [retryStatusCodes] - the array of HTTP status codes that will trigger retries for watchJob and fetch; default is [0,502,503,504]
	 */


	/** 
	 * This function is called when a job update is available.
	 * @callback JobUpdateCallback
	 * @param {Object} job the Job information object, or null if the job information could not be fetched
	 * @param {Object} error an error description object, or null if there was no error or the watch timed out on client side
	 * @param {Object} xhr the XmlHttpRequest object, or null in case of cancelled pending requests (error === "abort")
	 */
      /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.calculateRouteInfo = function (waypoints, options, exceptionPaths,  callerContext, onResult, timeout) {
		return sendRequest("calculateRouteInfo", {  waypoints: waypoints, options: options, exceptionPaths: exceptionPaths, callerContext: callerContext || client.callerContext }, onResult, timeout || client.calculateRouteInfo.timeout);
	};
	       /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.calculateRoute = function (waypoints, options, exceptionPaths, details,  callerContext, onResult, timeout) {
		return sendRequest("calculateRoute", {  waypoints: waypoints, options: options, exceptionPaths: exceptionPaths, details: details, callerContext: callerContext || client.callerContext }, onResult, timeout || client.calculateRoute.timeout);
	};
	       /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.calculateExtendedRoute = function (waypoints, options, exceptionPaths, details, countryInfoOptions,  callerContext, onResult, timeout) {
		return sendRequest("calculateExtendedRoute", {  waypoints: waypoints, options: options, exceptionPaths: exceptionPaths, details: details, countryInfoOptions: countryInfoOptions, callerContext: callerContext || client.callerContext }, onResult, timeout || client.calculateExtendedRoute.timeout);
	};
	       /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.calculateMatrixInfo = function (startwaypoints, destwaypoints, options, matrixOptions,  callerContext, onResult, timeout) {
		return sendRequest("calculateMatrixInfo", {  startwaypoints: startwaypoints, destwaypoints: destwaypoints, options: options, matrixOptions: matrixOptions, callerContext: callerContext || client.callerContext }, onResult, timeout || client.calculateMatrixInfo.timeout);
	};
		    	    	/**
	 * Job starter service method. For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the job object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.startCalculateMatrixInfo = function (startwaypoints, destwaypoints, options, matrixOptions,  callerContext, onResult, timeout) {
		return sendRequest("startCalculateMatrixInfo", {  startwaypoints: startwaypoints, destwaypoints: destwaypoints, options: options, matrixOptions: matrixOptions, callerContext: callerContext || client.callerContext }, onResult, timeout || client.startCalculateMatrixInfo.timeout);
	};
	
	/**
	 * Job runner convenience method that handles start, watching and fetching for the associated job methods.
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if left null, the default object will be used instead.
	 * @param {ResponseCallback} onResult - the callback for the final job result; this callback is required.
	 * @param {object} [watchOptions] - options passed to watchJob calls; define progressUpdatePeriod to activate regular progress reports.
	 * @param {JobUpdateCallback} [onUpdate] - callback for job status updates; called for major state changes and progress updates if activated in watchOptions.
	 * @param {RetryOptions} [retryOptions] - options for watch / fetch retries.
	 * @returns {object} the XMLHttpRequest object used, or null if the active request limit has been reached. 
	 */
	this.runCalculateMatrixInfo = function (startwaypoints, destwaypoints, options, matrixOptions,  callerContext, onResult, watchOptions, onUpdate, retryOptions) {
		return runJob(client.startCalculateMatrixInfo, [ startwaypoints,  destwaypoints,  options,  matrixOptions,  callerContext], client.fetchMatrixInfo, onResult, watchOptions, onUpdate, retryOptions);
	};	

	  	    /**
	 * Job result fetcher service method.
	 * @param {string} id - the unique job id to fetch.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the result of this job, which can be an error.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.fetchMatrixInfo = function (id, callerContext, onResult, timeout) {
		return sendRequest("fetchMatrixInfo", { id: id, callerContext: callerContext || client.callerContext }, onResult, timeout || client.fetchMatrixInfo.timeout);
	};	
			       /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.calculateReachableObjects = function (sink, binaryPathDesc, locations, options, expansionDesc,  callerContext, onResult, timeout) {
		return sendRequest("calculateReachableObjects", {  sink: sink, binaryPathDesc: binaryPathDesc, locations: locations, options: options, expansionDesc: expansionDesc, callerContext: callerContext || client.callerContext }, onResult, timeout || client.calculateReachableObjects.timeout);
	};
	       /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.calculateIsochrones = function (sink, options, isoOptions,  callerContext, onResult, timeout) {
		return sendRequest("calculateIsochrones", {  sink: sink, options: options, isoOptions: isoOptions, callerContext: callerContext || client.callerContext }, onResult, timeout || client.calculateIsochrones.timeout);
	};
	       /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.calculateTour = function (waypoints, options, exceptionPaths, details, countryInfoOptions,  callerContext, onResult, timeout) {
		return sendRequest("calculateTour", {  waypoints: waypoints, options: options, exceptionPaths: exceptionPaths, details: details, countryInfoOptions: countryInfoOptions, callerContext: callerContext || client.callerContext }, onResult, timeout || client.calculateTour.timeout);
	};
	       /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.calculateAdvancedTour = function (waypoints, tourOptions, routingOptions, exceptionPaths, details, countryInfoOptions,  callerContext, onResult, timeout) {
		return sendRequest("calculateAdvancedTour", {  waypoints: waypoints, tourOptions: tourOptions, routingOptions: routingOptions, exceptionPaths: exceptionPaths, details: details, countryInfoOptions: countryInfoOptions, callerContext: callerContext || client.callerContext }, onResult, timeout || client.calculateAdvancedTour.timeout);
	};
	       /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.searchForReachableObjects = function (sink, binaryPathDesc, options, reachableObjectOptions, exceptionPaths,  callerContext, onResult, timeout) {
		return sendRequest("searchForReachableObjects", {  sink: sink, binaryPathDesc: binaryPathDesc, options: options, reachableObjectOptions: reachableObjectOptions, exceptionPaths: exceptionPaths, callerContext: callerContext || client.callerContext }, onResult, timeout || client.searchForReachableObjects.timeout);
	};
	       /**
	 * For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the response object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.calculateBulkRouteInfo = function (waypoints, options, exceptionPaths,  callerContext, onResult, timeout) {
		return sendRequest("calculateBulkRouteInfo", {  waypoints: waypoints, options: options, exceptionPaths: exceptionPaths, callerContext: callerContext || client.callerContext }, onResult, timeout || client.calculateBulkRouteInfo.timeout);
	};
		    	    	/**
	 * Job starter service method. For the operation itself and its leading parameters please refer to PTV xServer API documentation. 
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the job object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.startCalculateBulkRouteInfo = function (waypoints, options, exceptionPaths,  callerContext, onResult, timeout) {
		return sendRequest("startCalculateBulkRouteInfo", {  waypoints: waypoints, options: options, exceptionPaths: exceptionPaths, callerContext: callerContext || client.callerContext }, onResult, timeout || client.startCalculateBulkRouteInfo.timeout);
	};
	
	/**
	 * Job runner convenience method that handles start, watching and fetching for the associated job methods.
	 * @param {...*} functionalParameters - please refer to PTV xServer API documentation for functional parameters.
	 * @param {object} [callerContext] the CallerContext object to be used; if left null, the default object will be used instead.
	 * @param {ResponseCallback} onResult - the callback for the final job result; this callback is required.
	 * @param {object} [watchOptions] - options passed to watchJob calls; define progressUpdatePeriod to activate regular progress reports.
	 * @param {JobUpdateCallback} [onUpdate] - callback for job status updates; called for major state changes and progress updates if activated in watchOptions.
	 * @param {RetryOptions} [retryOptions] - options for watch / fetch retries.
	 * @returns {object} the XMLHttpRequest object used, or null if the active request limit has been reached. 
	 */
	this.runCalculateBulkRouteInfo = function (waypoints, options, exceptionPaths,  callerContext, onResult, watchOptions, onUpdate, retryOptions) {
		return runJob(client.startCalculateBulkRouteInfo, [ waypoints,  options,  exceptionPaths,  callerContext], client.fetchBulkRouteInfo, onResult, watchOptions, onUpdate, retryOptions);
	};	

	  	    /**
	 * Job result fetcher service method.
	 * @param {string} id - the unique job id to fetch.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the result of this job, which can be an error.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.fetchBulkRouteInfo = function (id, callerContext, onResult, timeout) {
		return sendRequest("fetchBulkRouteInfo", { id: id, callerContext: callerContext || client.callerContext }, onResult, timeout || client.fetchBulkRouteInfo.timeout);
	};	
			     /**
	 * Job watcher service method.
	 * @param {string} id - the unique job id to watch.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the job object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.watchJob = function (id, watchOptions, callerContext, onResult, timeout) {
		return sendRequest("watchJob", { id: id, watchOptions: watchOptions, callerContext: callerContext || client.callerContext }, onResult, timeout || client.watchJob.timeout);
	};	

    /**
	 * Service method attempting to stop a job.
	 * @param {string} id - the unique job id to stop.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the job object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.stopJob = function (id, callerContext, onResult, timeout) {
		return sendRequest("stopJob", { id: id, callerContext: callerContext || client.callerContext }, onResult, timeout || client.stopJob.timeout);
	};

    /**
	 * Service method to delete a job.
	 * @param {string} id - the unique job id to delete.
	 * @param {object} [callerContext] the CallerContext object to be used; if omitted or set to null, the default object will be used instead.
	 * @param {ResponseCallback} [onResult] the callback to be used; if omitted, the request will be sent synchronously.
	 * @param {number} [timeout] the client timeout for the request in ms; if omitted, the default value of this method's static timeout variable will be used; the default is zero, indicating no timeout.
	 * @returns {object} in the (recommended) asynchronous mode, the XMLHttpRequest object used, or null if the active request limit has been reached. In the synchronous mode, the job object.
	 * @throws {object} only in the synchroneous mode: the error message from the server, or an Error object if a CORS request would be needed for an older IE browser.
	 */
	this.deleteJob = function (id, callerContext, onResult, timeout) {
		return sendRequest("deleteJob", { id: id, callerContext: callerContext || client.callerContext }, onResult, timeout || client.deleteJob.timeout);
	};

}
