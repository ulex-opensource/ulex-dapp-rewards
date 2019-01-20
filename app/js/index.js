/* globals web3 */
import $ from 'jquery';
import EmbarkJS from 'Embark/EmbarkJS';
import ULEXReward from 'Embark/contracts/ULEXReward';

const OpenSeaLink = 'https://rinkeby.opensea.io/assets';

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

    // Contract Info
    $('#div_info #text_address').text(curContract.options.address);
    baseTokenURI = await curContract.methods.baseTokenURI().call();
    $('#div_info #text_baseTokenURI').text(baseTokenURI);
    web3.eth.getAccounts().then(async function (accounts) {
      $('#div_list_owner #input_address').val(accounts[1]);
      $('#div_mint #input_address').val(accounts[1]);
      const divInfo = $('#div_info');
      for (var i = 0; i < 3 && i < accounts.length; i++) {
        const minter = await curContract.methods.isMinter(accounts[i]).call();
        const balance = await web3.eth.getBalance(accounts[i]);
        const item = `<p>Account[${i}]: ${accounts[i]}<br>${minter} | ${web3.utils.fromWei(balance)}</p>`;
        divInfo.append(item);
      }
    });

    // Mint NFT
    // TODO write attribute JSON to IPFS
    // TODO upload image and store to IPFS
    // ping this after mint or change: https://rinkeby-api.opensea.io/api/v1/asset/<your_contract_address>/<token_id>/?force_update=true
    $('#div_mint #button_execute').click(async function () {
      const address = $('#div_mint #input_address').val();
      const id = inputToUint256($('#div_mint #input_id').val());
      await curContract.methods.mintWithTokenURI(address, id, baseTokenURI + id).send({ gas: 4000000 });

      $('#div_mint #text_result').text('Done, ID ' + id);
    });

    // Get an NFT by ID
    $('#div_list_id #button_query').click(async function () {
      $('#div_list_id p').remove();
      const id = inputToUint256($('#div_list_id #input_id').val());
      const owner = await curContract.methods.ownerOf(id).call();
      const uri = await curContract.methods.tokenURI(id).call();
      const item = `<p>NFT | <a href="${uri}" target="_blank">MetaData</a> | <a href="${OpenSeaLink}/${curContract.options.address}/${id}" target="_blank">OpenSea</a> | Owner[${owner}]</p>`;
      $('#div_list_id').append(item);
    });

    // List an owners NFTs
    $('#div_list_owner #button_list').click(async function () {
      $('#div_list_owner p').remove();
      const owner = $('#div_list_owner #input_address').val();
      const count = await curContract.methods.balanceOf(owner).call();
      for (var i = 0; i < count; i++) {
        const id = await curContract.methods.tokenOfOwnerByIndex(owner, i).call();
        const uri = await curContract.methods.tokenURI(id).call();
        const item = `<p>NFT | <a href="${uri}" target="_blank">MetaData</a> | <a href="${OpenSeaLink}/${curContract.options.address}/${id}" target="_blank">OpenSea</a> | ID[${id}]</p>`;
        $('#div_list_owner').append(item);
      }
    });

    // List all minted NFTs
    $('#div_list #button_list').click(async function () {
      $('#div_list p').remove();
      const count = await curContract.methods.totalSupply().call();
      for (var i = 0; i < count; i++) {
        const id = await curContract.methods.tokenByIndex(i).call();
        const owner = await curContract.methods.ownerOf(id).call();
        const uri = await curContract.methods.tokenURI(id).call();
        const item = `<p>NFT | <a href="${uri}" target="_blank">MetaData</a> | <a href="${OpenSeaLink}/${curContract.options.address}/${id}" target="_blank">OpenSea</a> | ID[${id}] Owner[${owner}]</p>`;
        $('#div_list').append(item);
      }
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
