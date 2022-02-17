import chai, { expect } from "chai";
import { Contract } from "ethers";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

chai.use(solidity);

context('#NftFactory', async() => {
    let nftFactory: Contract;
    let admin: SignerWithAddress;
    let account1: SignerWithAddress;

    beforeEach(async() => {
        ([ admin, account1 ] = await ethers.getSigners()) 
        const NftContract = await ethers.getContractFactory("NftFactory", admin);
        nftFactory = await NftContract.deploy();
        await nftFactory.deployed();
    })

    it('Deploy success', async() => {
        await expect(nftFactory.address).to.be.properAddress;
        const ownerAddress = await nftFactory.owner();
        await expect(ownerAddress).to.be.equal(admin.address);
    });

    it('Set base uri', async() => {
        let baseURI = await nftFactory.prefixBaseURI();
        expect(baseURI).to.be.eq("");
        const prefixBaseURI = "https://buni.nft";
        await nftFactory.connect(admin).setPrefixBaseURI(prefixBaseURI);
        baseURI = await nftFactory.prefixBaseURI();
        expect(baseURI).to.be.equal(prefixBaseURI);
    });    

    it('Only set uri by admin', async() => {
        await expect(nftFactory.connect(account1).setPrefixBaseURI("TEMP")).to.be.revertedWith("Ownable: caller is not the owner");
    });

    context('Deploy a NFT contract', async() => {
        const contractName = "TestNFT";
        const contractSymbol = "NFT";
        beforeEach(async() => {
            const tx = await nftFactory.connect(account1).deploy(contractName, contractSymbol);
            console.log(tx);
        });
        it('Test stuff', async() => {
            expect(1).to.be.eq(1);
        });
    })
})