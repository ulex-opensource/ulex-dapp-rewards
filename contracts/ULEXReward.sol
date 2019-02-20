pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";

/**
 * @title ULEXReward
 * ULEX Rewards - Ulex Community NFT for rewarding contributors
 * @dev 
 */
contract ULEXReward is ERC721Full, ERC721MetadataMintable {
    using SafeMath for uint256;

    /*** State Variables ***/
    uint256 private tokenId = 0;
    
    /*** Events ***/

    /* Initializes contract */
    constructor() ERC721Full("ULEX Rewards", "ULEX") public { }

    function mintWithTokenURI(address to, string calldata tokenURI) external {
        require(mintWithTokenURI(to, tokenId, tokenURI), "");
        tokenId = tokenId.add(1);
    }
}
