var tunnel = require ('tunnel-ssh');

var config_ssh_tunnel = {
    username: '557f303d4382eca9d20000ad',
    host: 'calculateroute-sierrica.rhcloud.com',
    privateKey: require('fs').readFileSync('id_rsa'),
    port: 22,
    srcHost: '127.0.0.1',
    dstPort: 27017,
    srcPort: 27017,
    dstHost: '127.2.24.2'
};
var server = tunnel(config_ssh_tunnel, function (error, result) {


});