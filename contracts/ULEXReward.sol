pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title ULEXReward
 * ULEX Rewards - contract for a non-fungible reward
 * @dev 
 */
contract ULEXReward is ERC721Token, Ownable {
    address proxyRegistryAddress;

    constructor(address _proxyRegistryAddress) ERC721Token("Creature", "CREATURE") public {
        proxyRegistryAddress = _proxyRegistryAddress;
    }

    /**
    * @dev Returns an URI for a given token ID
    */
    function tokenURI(uint256 _tokenId) public view returns (string) {
        return Strings.strConcat(baseTokenURI(), Strings.uint2str(_tokenId));
    }

    function baseTokenURI() public view returns (string) {
        return "https://opensea-creatures-api.herokuapp.com/api/creature/";
    }

    /**
    * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
    */
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        // Whitelist OpenSea proxy contract for easy trading.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        if (proxyRegistry.proxies(owner) == operator) {
            return true;
        }
        return super.isApprovedForAll(owner, operator);
    }
}

contract OwnableDelegateProxy { }

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}


// contract ULEXReward is ERC721Full, ERC721Mintable {
//     using SafeMath for uint256;

//     /*** TODO Testing (remove for production) ***/

//     uint256 public constant OPENING_RATE = 6400;

//     /*** State Variables ***/
    
//     /*** Events ***/

//     /* Initializes contract */
//     constructor() ERC721Full("ULEXReward", "ULEX") public { }

//     // To mint, call mintWithTokenURI(to, tokenId, tokenURI) // TODO add or get timestamp when minted for timeout
//     // to read asset, call tokenURI(tokenId)
    
//     /* (called whenever someone tries to send ether to this contract) */
//     function() external payable {
//         require(msg.value != 0, ""); // Stop spamming, contract only calls, etc
//         require(msg.sender != address(0), ""); // Prevent transfer to 0x0 address
//         require(msg.sender != address(this), ""); // Prevent calls from this.transfer(this)
//         // assert(address(this).balance >= msg.value, ""); // this.balance gets updated with msg.value before this function starts 
//     }
// }
