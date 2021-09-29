/* eslint-disable curly */
const net = require('net');
const Q = require('q');

module.exports = function (url, port, user) {
  const deferred = Q.defer();
  const connection = new net.Socket();
  let buffer = new Buffer('0');

  connection.connect(port, url);
  connection.on('data', function (data) {
    const arrayData = data.toString().split(':');

    if (arrayData[0] === 'WHORU') {
      connection.write(
        ['IAM', arrayData[1].replace(/\n/gi, ''), user, 'at'].join(':') + '\n'
      );
      return;
    }

    if (arrayData[0] === 'SUCCESS') return;
    buffer = Buffer.concat([buffer, new Buffer(data, 'binary')]);
  });

  connection.on('end', function (data) {
    console.log('File Transmited, size:', buffer.length);
    deferred.resolve(buffer);
  });

  return deferred.promise;
};
