/* globals web3 */
import $ from 'jquery';
import EmbarkJS from 'Embark/EmbarkJS';
import ULEXReward from 'Embark/contracts/ULEXReward';

const uint256MAX = web3.utils.toBN('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
function inputToUint256 (inv) {
  const invt = +inv;
  if (isNaN(invt) || invt % 1 !== 0) inv = web3.utils.utf8ToHex(inv);
  inv = web3.utils.toBN(inv).abs();
  if (inv.gt(uint256MAX)) throw new Error('web3 uint256 overflow!');
  return inv;
}

window.addEventListener('load', async () => {
  if (!window.ethereum && !window.web3) {
    console.log('Non-Ethereum browser detected. TODO redirect to static page to describe solution.'); return;
  }
  if (window.ethereum) {
    try {
      await window.ethereum.enable();
      // Acccounts now exposed
    } catch (err) {
      console.log(err); return;
    }
  }

  EmbarkJS.onReady(async (err) => {
    // ** Check blockchain
    if (err) {
      // If err is not null then it means something went wrong connecting to ethereum
      // you can use this to ask the user to enable metamask for e.g
      console.log(err); return;
    }
    console.log('blockchain OK');
    // // ** Check communication
    // EmbarkJS.Messages.Providers.whisper.getWhisperVersion((err, _version) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log('whisper OK');
    // });
    // ** Check storage
    try {
      let result = await EmbarkJS.Storage.isAvailable();
      if (!result) { console.log('storage not available'); return; }
      console.log('storage OK');
    } catch (err) { console.log(err); return; }

    // ** Main
    var curContract = ULEXReward;
    var baseTokenURI;

    // Get current contract address
    const urlParams = new URLSearchParams(window.location.search);
    const contractAddr = urlParams.get('contract');
    if (web3.utils.isAddress(contractAddr)) {
      curContract = new EmbarkJS.Blockchain.Contract({
        abi: ULEXReward.options.jsonInterface,
        address: contractAddr,
        // from: contract.deploymentAccount || web3.eth.defaultAccount,
        // gas: constants.tests.gasLimit,
        web3: web3
      });
    } else {
      $('#div_deployContract').removeClass('w3-hide');
    }

    // Deploy new contract
    // TODO will this work with metamask, infura and on testnet (rinkeby)
    $('#div_deployContract #button_deploy').click(async function () {
      curContract = await ULEXReward.deploy({ data: ULEXReward.options.data }).send({ gas: 4000000 });
      window.location.search = 'contract=' + encodeURI(curContract.options.address);
    });

    // Set current contract
    $('#div_useContract #button_use').click(function () {
      var address = $('#div_useContract #input_address').val();
      curContract = new EmbarkJS.Blockchain.Contract({
        abi: ULEXReward.options.jsonInterface, address: address, web3: web3
      });
    });

    // Contract Info
    $('#div_info #text_address').text(curContract.options.address);
    baseTokenURI = await curContract.methods.baseTokenURI().call();
    $('#div_info #text_baseTokenURI').text(baseTokenURI);
    web3.eth.getAccounts().then(async function (accounts) {
      $('#div_balanceOf #input_address').val(accounts[1]);
      $('#div_mintWithTokenURI #input_address').val(accounts[1]);

      const divInfo = $('#div_info');
      for (var i = 0; i < 3 && i < accounts.length; i++) {
        const minter = await curContract.methods.isMinter(accounts[i]).call();
        const balance = await web3.eth.getBalance(accounts[i]);
        const item = `<p>account[${i}]: ${accounts[i]}<br>${minter} | ${web3.utils.fromWei(balance)}</p>`;
        divInfo.append(item);
      }
    });

    // Mint NFT
    // TODO write attribute JSON to IPFS
    // TODO upload image and store to IPFS 
    // ping this after mint or change: https://rinkeby-api.opensea.io/api/v1/asset/<your_contract_address>/<token_id>/?force_update=true
    $('#div_mintWithTokenURI #button_execute').click(async function () {
      const address = $('#div_mintWithTokenURI #input_address').val();
      const id = inputToUint256($('#div_mintWithTokenURI #input_id').val());
      await curContract.methods.mintWithTokenURI(address, id, baseTokenURI + id).send({ gas: 4000000 });
      $('#div_mintWithTokenURI #text_result').text('Done, ID ' + id);
    });
    
    // TODO list all owned NFTs
    // All Existing NFTs
    // link on OpenSea: https://rinkeby.opensea.io/assets/<your_contract_address>/<token_id>

    // Get Count of Owned NFT
    $('#div_balanceOf #button_query').click(async function () {
      const address = $('#div_balanceOf #input_address').val();
      const balance = await curContract.methods.balanceOf(address).call();
      $('#div_balanceOf #text_result').text(balance);
    });

    // Get NFT Metadata
    $('#div_tokenURI #button_query').click(async function () {
      const id = web3.utils.toBN($('#div_tokenURI #input_id').val());
      const uri = await curContract.methods.tokenURI(id).call();
      $('#div_tokenURI #text_result').text(uri);
    });
  });
});

/*
{
  "name": "Dave Starbelly",
  "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
  "external_url": "https://openseacreatures.io/3",
  "background_color": "FFFFFF",
  "attributes": [
    {
      "trait_type": "base",
      "value": "starfish"
    },
    {
      "trait_type": "eyes",
      "value": "big"
    },
    {
      "trait_type": "mouth",
      "value": "surprised"
    },
    {
      "trait_type": "level",
      "value": 5
    },
    {
      "trait_type": "stamina",
      "value": 1.4
    },
    {
      "trait_type": "personality",
      "value": "sad"
    },
    {
      "trait_type": "aqua_power",
      "display_type": "boost_number",
      "value": 40
    },
    {
      "trait_type": "stamina_increase",
      "display_type": "boost_percentage",
      "value": 10
    },
    {
      "trait_type": "generation",
      "display_type": "number",
      "value": 2
    }
  ]
}
*/
