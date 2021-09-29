const read = require('./reader');
const write = require('./writter');

const config = {
  url: process.env.URL || 'challenge.airtime.com',
  port: process.env.PORT || 2323,
  user: process.env.USER || 'sadaf.prt@gmail.com',
};

read(config.url, config.port, config.port).then(write);
