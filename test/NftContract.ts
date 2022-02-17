import chai, { expect } from "chai";
import { Contract } from "ethers";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);

context('#NftContract', async() => {
    let nftFactory: Contract;
    let nftContract: Contract;
    let admin: SignerWithAddress;
    let account1: SignerWithAddress;
    const prefixBaseURI = "https://buni.nft/";
    const contractName = "TestNFT";
    const contractSymbol = "NFT";

    beforeEach(async() => {
        ([ admin, account1 ] = await ethers.getSigners());
        const NftFactory = await ethers.getContractFactory("NftFactory", admin);
        nftFactory = await NftFactory.deploy();
        await nftFactory.deployed();

        await nftFactory.connect(admin).setPrefixBaseURI(prefixBaseURI);
        await nftFactory.connect(account1).deploy(contractName, contractSymbol);
        const deployedAddress = await nftFactory.getNftOfUserByIndex(account1.address, 0);
        nftContract = await ethers.getContractAt("NftContract", deployedAddress);
    })
    it('Test stuff', () => {
        expect(1).to.be.equal(1);
    });

    it('Get correct name and symbol', async() => {
        const name = await nftContract.name();
        const symbol = await nftContract.symbol();
        expect(name).to.be.equal(contractName);
        expect(symbol).to.be.equal(contractSymbol);
    });

    it('Get correct URI', async() => {
        const baseURI = await nftContract.baseURI();
        const expectedURI = (`${prefixBaseURI}${nftContract.address.slice(2)}/`).toLowerCase();
        expect(baseURI).to.be.equal(expectedURI);
    });

    it('Get correct owner', async() => {
        const owner = await nftContract.owner();
        await expect(owner).to.be.equal(account1.address);
    })
})