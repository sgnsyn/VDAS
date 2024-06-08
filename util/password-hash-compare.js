const bcrypt = require("bcrypt");

const saltRounds = 10;

function b_hash(plainTextPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainTextPassword, saltRounds, function (err, hash) {
      if (err) {
        console.log("err while hashing, in util password-hash-compare");
        resolve("err");
      } else {
        resolve(hash);
      }
    });
  });
}
function b_compare(plainTextPassword, storedHashedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainTextPassword, storedHashedPassword, function (err, result) {
      if (err) {
        console.log("err while hashing, in util password-hash-compare");
        resolve("err");
      } else if (result) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

module.exports = {
  b_hash,
  b_compare,
};
