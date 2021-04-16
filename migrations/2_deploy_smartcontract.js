const nexyohub = artifacts.require("nexyohub.sol");

module.exports = function (deployer) {
  const network_name='Nexyo happy Account-Sharing'
  deployer.deploy(nexyohub, network_name);
};
