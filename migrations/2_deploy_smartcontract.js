const transactcont = artifacts.require("nexyotransact");
const fs = require('fs');

module.exports = function (deployer) {
  deployer.deploy(transactcont).then(function() {
    const hotseat=transactcont.address;
    fs.writeFileSync('theaddress.md', hotseat);
    console.log(fs.readFileSync('theaddress.md', 'utf8'),'has been saved to', process.cwd());

  });
};
