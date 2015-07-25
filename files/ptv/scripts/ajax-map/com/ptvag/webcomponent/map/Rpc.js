/**
 * A custom RPC subclass that adds information (like the desired backend
 * server) to every request.
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance that is
 *              creating this Rpc instance (used for injecting information into
 *              every RPC call).
 * @param   url {string}            the URL of the service.
 * @param   serviceName {string}    the name of the service class.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.Rpc", qxp.io.remote.Rpc,
function(map, url, serviceName) {
    qxp.io.remote.Rpc.call(this, url, serviceName);

    var self = this;

    var setURLParameter = function(name, value) {
        var url = self.getUrl();
        var encodedValue = encodeURIComponent(value);
        var paramIndex = url.indexOf("?" + name + "=");
        if (paramIndex == -1) {
            paramIndex = url.indexOf("&" + name + "=");
        }
        if (paramIndex == -1) {
            url += (url.indexOf("?") == -1 ? "?" : "&") +
                name + "=" + encodedValue;
        } else {
            var startIndex = paramIndex + name.length + 2;
            var endIndex = url.indexOf("&", startIndex);
            if (endIndex == -1) {
                url = url.substring(0, startIndex) + encodedValue;
            } else {
                url = url.substring(0, startIndex) + encodedValue +
                    url.substring(endIndex);
            }
        }
    };

    // overridden
    var superCallInternal = self._callInternal;
    /** Overridden to add additional information. */
    self._callInternal = function() {
        setURLParameter("backendServer", map.getBackendServer());
        setURLParameter(com.ptvag.webcomponent.map.RequestBuilder.getTokenName(),
            com.ptvag.webcomponent.map.RequestBuilder.getTokenValue());
        return superCallInternal.apply(self, arguments);
    };

    // overridden
    var superRefreshSession = self.refreshSession;
    /**
     * Overridden for state handling.
     *
     * @param handler {function}    the handler function to call when the
     *                              session has been refreshed or when no
     *                              refresh is necessary. The only parameter is
     *                              a boolean value that indicates when there
     *                              was an error (in which case
     *                              <code>false</code> is passed to the handler
     *                              function).
     */
    self.refreshSession = function(handler) {
        if (com.ptvag.webcomponent.map.Map.STATELESS_MODE) {
            handler(true);
        } else {
            superRefreshSession.apply(self, arguments);
        }
    };
});
