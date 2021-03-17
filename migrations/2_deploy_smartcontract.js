const nexyohub = artifacts.require("nexyohub.sol");

module.exports = function (deployer) {
  const network_name='ZAMG'
  deployer.deploy(nexyohub, network_name);
};
