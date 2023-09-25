const fpcalc = require('fpcalc');

// Example audio fingerprints represented as strings
exports.getSimilarity = function (fingerprint1, fingerprint2) {
  const dotProduct = fingerprint1.reduce(
    (acc, val, index) => acc + val * fingerprint2[index],
    0,
  );
  const norm1 = Math.sqrt(
    fingerprint1.reduce((acc, val) => acc + val * val, 0),
  );
  const norm2 = Math.sqrt(
    fingerprint2.reduce((acc, val) => acc + val * val, 0),
  );
  const sim = dotProduct / (norm1 * norm2);
  return sim.toFixed(2) * 100;
};

const fingerPrint = function (audio) {
  return new Promise((resolve, reject) => {
    fpcalc(audio, { raw: true }, function (err, result) {
      if (err) reject(err);
      resolve(result.fingerprint);
    });
  });
};

exports.getFingerPrint = async function (audio) {
  return await fingerPrint(audio);
};
