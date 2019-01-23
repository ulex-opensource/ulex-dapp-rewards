pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";

/**
 * @title ULEXReward
 * ULEX Rewards - Ulex Community NFT for rewarding contributors
 * @dev 
 */
contract ULEXReward is ERC721Full, ERC721MetadataMintable {
    using SafeMath for uint256;
    // using Address for address;

    /*** TODO Testing (remove for production) ***/

    // uint256 public constant OPENING_RATE = 6400;

    /*** State Variables ***/
    uint256 private tokenId = 0;
    
    /*** Events ***/

    /* Initializes contract */
    constructor() ERC721Full("ULEXReward", "ULEX") public { }

    function mintWithTokenURI(address to, string tokenURI) external {
        require(mintWithTokenURI(to, tokenId, tokenURI), "");
        tokenId = tokenId.add(1);
    }
    // To mint, call mintWithTokenURI(to, tokenId, tokenURI)
    // to read asset url, call tokenURI(tokenId)
    
    // TODO override tokenURI(tokenId) to combine an ipfs host, stored seperately and changeable, with the unchangeable ipfs url, ie
    // "https://ipfs.infura.io" + "/ipfs/QmcvYFgYKZa4pzSgTYktHKY8m6bSFsVBmYXPTWEMVv9Sne"
    // TODO make public facing dapp that lets people send ETH or DAI here, how to seperate public and admin?
    // TODO look at Status plugin to see how to put public dapp on Status on phone
    // TODO add this in with reward amount levels that auto mint for public dapp
    // /* (called whenever someone tries to send ether to this contract) */
    // function() external payable {
    //     require(msg.value != 0, ""); // Stop spamming, contract only calls, etc
    //     require(msg.sender != address(0), ""); // Prevent transfer to 0x0 address
    //     require(msg.sender != address(this), ""); // Prevent calls from this.transfer(this)
    //     // assert(address(this).balance >= msg.value, ""); // this.balance gets updated with msg.value before this function starts 
    // }
}
