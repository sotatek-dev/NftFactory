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
            await nftFactory.connect(account1).deploy(contractName, contractSymbol);
        });
        it('There is one deployed NFT', async() => {
            const numberOfDeployed = await nftFactory.getNumberOfDeployedNfts();
            expect(numberOfDeployed).to.be.equal(1);
        });

        it('Set correct info of deployed nft', async() => {
            const deployed = await nftFactory.getNftOfUserByIndex(account1.address, 0);
            const info = await nftFactory.getInfoOfDeployedNft(deployed);
            expect(info.name).to.be.eq(contractName);
            expect(info.symbol).to.be.eq(contractSymbol);
            expect(info.deployedUser).to.be.equal(account1.address);
        });

        it('Get address, name and symbol of deployed nft', async() => {
            const res = await nftFactory.getAddressAndNameAndSymbolOfNfts(account1.address);
            const deployedAddress = (await nftFactory.getNftOfUserByIndex(account1.address, 0));
            const addreses = res[0];
            const names = res[1];
            const symbols = res[2];
            expect(addreses[0]).to.be.equal(deployedAddress);
            expect(names[0]).to.be.equal(contractName);
            expect(symbols[0]).to.be.equal(contractSymbol);
        });
    })
})