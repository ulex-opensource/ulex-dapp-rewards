/* globals $ */

import EmbarkJS from 'Embark/EmbarkJS';
import ULEXReward from 'Embark/contracts/ULEXReward';

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
    if (err) {
      // If err is not null then it means something went wrong connecting to ethereum
      // you can use this to ask the user to enable metamask for e.g
      console.log(err); return;
    }
    console.log('blockchain OK');

    // EmbarkJS.Messages.Providers.whisper.getWhisperVersion((err, _version) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log('whisper OK');
    // });

    try {
      let result = await EmbarkJS.Storage.isAvailable();
      if (!result) {
        console.log('storage not available'); return;
      }
      console.log('storage OK');
    } catch (err) {
      console.log(err); return;
    }

    ULEXReward.methods.baseTokenURI().call().then(function (value) {
      $('#ULEXReward_baseTokenURI').text(value);
      console.log(value);
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
