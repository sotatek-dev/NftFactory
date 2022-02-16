//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftContract is ERC721("NFT", "NFT"), Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public baseURI;

    constructor(address creator, string memory _prefixBaseURI) {
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