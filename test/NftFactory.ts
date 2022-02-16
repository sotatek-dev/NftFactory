import chai, { expect } from "chai";
import { Contract } from "ethers";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

chai.use(solidity);

context('#NftFactory', async() => {
    let nftContract: Contract;
    let admin: SignerWithAddress;
    let account1: SignerWithAddress;

    beforeEach(async() => {
        ([ admin, account1 ] = await ethers.getSigners()) 
        const NftContract = await ethers.getContractFactory("NftFactory", admin);
        nftContract = await NftContract.deploy();
        await nftContract.deployed();
    })

    it('Deploy success', async() => {
        await expect(nftContract.address).to.be.properAddress;
        const ownerAddress = await nftContract.owner();
        await expect(ownerAddress).to.be.equal(admin.address);
    });

    it('Set base uri', async() => {
        let baseURI = await nftContract.prefixBaseURI();
        expect(baseURI).to.be.eq("");
        const prefixBaseURI = "https://buni.nft";
        await nftContract.connect(admin).setPrefixBaseURI(prefixBaseURI);
        baseURI = await nftContract.prefixBaseURI();
        expect(baseURI).to.be.equal(prefixBaseURI);
    });    

    it('Only set uri by admin', async() => {
        await expect(nftContract.connect(account1).setPrefixBaseURI("TEMP")).to.be.revertedWith("Ownable: caller is not the owner");
    })
})