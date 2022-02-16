//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftContract.sol";

contract NftFactory is Ownable {
    // TODO Add max number of deployed NFT for each user
    // Mapping from user to own deployed NFTs
    mapping(address => address[]) private _deployedNfts; 
    // Array of all deployed NFTs
    address[] private _allNfts;

    struct NftInfo {
        uint256 createdAt;
        string name;
        string symbol;
        address deployedUser;
    }
    // Mapping from deployed NFT address to Nft info
    mapping(address => NftInfo) private _nftInfos;

    // prefixBaseURI to set for each deploy NFT, only set by owner of factory
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
        _nftInfos[deployed] = NftInfo(block.timestamp, _name, _symbol, msg.sender);
        emit Deployed(msg.sender, deployed, _allNfts.length - 1);
    }

    /**
     * @notice Get deployed NFTs of an user
     * @param  userAddress address of user
     * @return deployedNfts Array of deployed NFTs of user
     */
    function getDeployedNfts(address userAddress) public view returns (address[] memory deployedNfts) {
        return _deployedNfts[userAddress];
    }
}