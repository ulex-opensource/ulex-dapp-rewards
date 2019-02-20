module.exports = {
  // default applies to all environments
  default: {
    // Automatically call `ethereum.enable` if true.
    dappAutoEnable: false,
    // order of connections the dapp should connect to
    dappConnection: [
      '$WEB3' // uses pre existing web3 object if available (e.g in Mist)
    ],
    gas: 'auto',
    contracts: {
      'SafeMath': { deploy: false },
      'Address': { deploy: false },
      'Roles': { deploy: false },

      'ERC721Full': { deploy: false },
      'ERC721MetadataMintable': { deploy: false },
      'ERC721': { deploy: false },
      'ERC721Enumerable': { deploy: false },
      'ERC721Metadata': { deploy: false }

    },
    versions: {
      'web3': '1.0.0-beta',
      'solc': '0.5.0'
    }
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    dappConnection: [
      'ws://localhost:8546',
      'http://localhost:8545',
      '$WEB3' // uses pre existing web3 object if available (e.g in Mist)
    ],
    deployment: {
      host: 'localhost', // Host of the blockchain node
      port: 8546, // Port of the blockchain node
      type: 'ws' // Type of connection (ws or rpc)
    }
  },

  // merges with the settings in default
  // used with 'embark run privatenet'
  privatenet: {
  },

  // merges with the settings in default
  // used with 'embark run testnet'
  testnet: {
    contracts: {
      'ULEXReward': { deploy: false }
    },
    deployment: {
      host: 'rinkeby.infura.io/ff6c5092410a45acb36722e1d41ca448',
      port: false,
      protocol: 'https',
      type: 'rpc'
    }
  },

  // merges with the settings in default
  // used with 'embark run livenet'
  livenet: {
    contracts: {
      'ULEXReward': { deploy: false }
    },
    deployment: {
      host: 'mainnet.infura.io/ff6c5092410a45acb36722e1d41ca448',
      port: false,
      protocol: 'https',
      type: 'rpc'
    }
  }

  // you can name an environment with specific settings and then specify with
  // 'embark run custom_name' or 'embark blockchain custom_name'
  // custom_name: {
  // }
};
