const pino = require('pino');
const pinoms = require('pino-multi-stream');
const pinoCloudWatch = require('pino-cloudwatch');

module.exports.buildMultistream = function (logLevel, cwOptions) {

    return pinoms.multistream([{
        stream: pino.destination(1),
        level: logLevel
    }, {
        stream: pinoCloudWatch(cwOptions),
        level: logLevel
    }]);
};
