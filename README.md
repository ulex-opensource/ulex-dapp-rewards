# ulex-dapp-rewards
Ulex Community NFT for rewarding contributors

## Development Requirements

https://embark.status.im/docs/installation.html
- install the latest stable, ie `npm -g install embark`
- make sure to install local IPFS

`npm install`

## Development

Run with local development blockchain and webserver

`embark run`

Run all code tests

`embark test`

Deploy to public testnet (Rinkeby + IPFS)
- must be running `ipfs daemon` in seperate console
- `embark upload testnet`
- `ipfs pin add -r <your-ipfs-hash>/`
- TODO get embark to pin files on Infura
