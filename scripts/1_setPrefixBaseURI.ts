import { ethers, network } from "hardhat";
import { getContracts } from "./utils";

async function main() {
    const networkName = network.name; 
    const addresses = getContracts()[networkName];
    const nftFactory = await ethers.getContractAt("NftFactory", addresses["NftFactory"]);

    const prefixBaseURI = "https://api-nft.buni/"
    console.log(`Start set uri for nftFactory`);
    await nftFactory.setPrefixBaseURI(prefixBaseURI);
    console.log(`Set successfully`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
})