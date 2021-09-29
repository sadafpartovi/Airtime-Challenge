/* eslint-disable curly */
/* eslint-disable func-style */
module.exports = function reader(data, file) {

  const output = new Buffer('0');

  packages = generateValidPackages(data);
  console.log(data);


  for (key in Object.keys(packages)) {
    output = Buffer.concat([output, packages[key]]);
  }
  require('fs').writeFileSync('Message.raw', output);
  console.log('Message Saved');
};

function generateValidPackages(data) {
  const validPackages = [];

  for (location = 0; location < data.length; location += 12 + LEN) {
    const SEQ = data.slice(location, location + 4);
    const CHK = data.slice(location + 4, location + 8);
    const LEN = data.readInt32BE(location + 8);
    const PCM = data.slice(location + 12, location + 12 + LEN);

    if (verifyChecksum(SEQ, CHK, PCM)) validPackages[SEQ.readInt32BE(0)] = PCM;
  }

  return validPackages;
}

function verifyChecksum(SEQ, CHK, DATA) {
  const SQC = new Buffer(4);
  SEQ.copy(SQC); // Force copy 4 bytes.

  for (let i = 0; i < DATA.length; i += 4) {
    const slice = DATA.slice(i, i + 4);
    const correction = new Buffer([171, 171, 171, 171]);

    for (let a = 0; a < slice.length; ++a) {
      correction[a] = slice[a];
    }

    for (var b = 0; b < 4; ++b) {
      SQC[b] = SQC[b] ^ correction[b];
    } // XOR'ing
  }

  return SQC.readInt32BE(0) === CHK.readInt32BE(0);
}
