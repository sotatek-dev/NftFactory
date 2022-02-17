import { ethers, network } from "hardhat";
import { saveContract } from "./utils";

async function main() {
    const networkName = network.name;
    console.log(`Deploying NftFactory contract`);
    const NftFactory = await ethers.getContractFactory("NftFactory");
    const nftFactory = await NftFactory.deploy();
    await nftFactory.deployed();
    console.log(`Deployed success at address ${nftFactory.address}. Start saving`);
    await saveContract(networkName, 'NftFactory', nftFactory.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
})