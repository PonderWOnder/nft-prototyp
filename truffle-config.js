
module.exports = {
  networks: {
    development: {
    host: "127.0.0.1",     // Localhost (default: none)
    port: 8545,            // Standard Ethereum port (default: none)
    network_id: "5777",       // Any network (default: none)
    },
  },
  //contracts_directory: '../contracts',
  compilers: {
    solc: {       // See the solidity docs for advice about optimization and evmVersion
      version: '0.8.0',
      optimizer: {
         enabled: true,
         runs: 200
    }
  },
 }
}
