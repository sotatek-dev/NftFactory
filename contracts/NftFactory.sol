//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftContract.sol";

contract NftFactory is Ownable {
    mapping(address => address[]) private _deployedNfts; 
    address[] private _allNfts;

    string public prefixBaseURI;

    event Deployed(address indexed deployer, address indexed deployedNft, uint256 indexed index);

    constructor() {
        transferOwnership(msg.sender);
    }

    //TODO Add blacklist
    /**
     * @notice Deploy new NFT use this factory
     * @dev All user can create new nft
     * @param _name Name of new NFT
     * @param _symbol Symbol of new NFT
     * @return deployed Address of new deployed nft
     */
    function deploy(string memory _name, string memory _symbol) external returns (address deployed) {
        require(bytes(_name).length > 0, "Deploy::Name must not empty");
        require(bytes(_symbol).length > 0, "Deploy::Symbol must not empty");
        deployed = address(new NftContract(_name, _symbol, msg.sender, prefixBaseURI));
        _deployedNfts[msg.sender].push(deployed);
        _allNfts.push(deployed);
        emit Deployed(msg.sender, deployed, _allNfts.length - 1);
    }
}
