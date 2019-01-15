pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";

/**
 * @title ULEX ERC721 Token
 * @dev 
 */
contract ULEXToken is ERC721Full, ERC721Mintable {
    using SafeMath for uint256;

    /*** TODO Testing (remove for production) ***/

    uint256 public constant OPENING_RATE = 6400;

    /*** State Variables ***/
    
    /*** Events ***/

    /* Initializes contract */
    constructor() ERC721Full("ULEXToken", "ULEX") public { }

    // To mint, call mintWithTokenURI(to, tokenId, tokenURI) // TODO add or get timestamp when minted for timeout
    // to read asset, call tokenURI(tokenId)
    
    /* (called whenever someone tries to send ether to this contract) */
    function() external payable {
        require(msg.value != 0, ""); // Stop spamming, contract only calls, etc
        require(msg.sender != address(0), ""); // Prevent transfer to 0x0 address
        require(msg.sender != address(this), ""); // Prevent calls from this.transfer(this)
        // assert(address(this).balance >= msg.value, ""); // this.balance gets updated with msg.value before this function starts 
    }
}
