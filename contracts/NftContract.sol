//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public baseURI;

    constructor(string memory _name, string memory _symbol, address creator, string memory _prefixBaseURI) 
        ERC721(_name, _symbol)
    {
        transferOwnership(creator);
        baseURI = string(abi.encodePacked(_prefixBaseURI, address(this), "/"));
    }

    function mint(address to) public onlyOwner returns (uint256) {
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());

        return _tokenIdCounter.current();
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}