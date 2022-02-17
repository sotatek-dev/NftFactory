//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NftContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public baseURI;

    constructor(string memory _name, string memory _symbol, address creator, string memory _prefixBaseURI) 
        ERC721(_name, _symbol)
    {
        transferOwnership(creator);
        baseURI = string(abi.encodePacked(_prefixBaseURI, _toAsciiString(address(this)), "/"));
    }

    /**
     * @notice Mint new token
     * @dev only owner can call
     * @param to address of the receiver of NFT
     * @return Current available token index
     */
    function mint(address to) public onlyOwner returns (uint256) {
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());

        return _tokenIdCounter.current();
    }

    function _toAsciiString(address x) private pure returns (string memory) {
      bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = _char(hi);
            s[2*i+1] = _char(lo);            
        }
        return string(abi.encodePacked(s));
    }

    function _char(bytes1 b) private pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function currentToken() external view returns (uint256) {
        return _tokenIdCounter.current();    
    }
}