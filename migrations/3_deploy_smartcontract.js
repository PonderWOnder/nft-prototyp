const nexyohub = artifacts.require("nexyohub");
const fs = require('fs');




module.exports = function (deployer) {
  const network_name="Nexyo happy Account-Sharing";
  const sign="NYNFT";
  const rootcontract = fs.readFileSync(process.cwd()+'/theaddress.md', 'utf8');
  console.log('Contract Address of root Contract is provided at',rootcontract);
  deployer.deploy(nexyohub, network_name, sign, rootcontract);
};
