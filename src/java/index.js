const flatMappingList = require('./mapping');

module.exports = async function (pkg) {
  const url = flatMappingList[pkg];

  if (url) {
    return url;
  }
};
