require("dotenv").config();

import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-etherscan";
import 'hardhat-contract-sizer';

import { task } from "hardhat/config";
import { ethers } from "hardhat";

const privateKey = "0x" + process.env.PRIVATE_KEY;
const etherscan = process.env.ETHERSCAN;
const bscscan = process.env.BSCSCAN;
const infuraKey = process.env.INFURA_API_KEY;



// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
// task("accounts", "Prints the list of accounts", async () => {
//   const accounts = await ethers.getSigners();

//   for (const account of accounts) {
//     console.log(await account.getAddress());
//   }
// });

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  //defaultNetwork: "localhost",
  networks: {
    local: {
      url: "http://localhost:8545",
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${infuraKey}`,
      accounts: [privateKey],
    },
    tbsc: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      accounts: [privateKey],
      timeout: 20000,
      chainId: 97,
      gasPrice: 20000000000,
      gasMultiplier: 2,
    },    
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [privateKey],
      chainId: 56,
    } 
    // rinkeby: {
    //   url: `https://rinkeby.infura.io/v3/2be6cc1fa18b42e5b22d8fbf15a004c6`,
    //   accounts: [privateKey],
    // },
//     bsc: {
//       url: "https://bsc-dataseed.binance.org/",
//       accounts: [privateKey],
//     },
  },
  etherscan: {
    // apiKey: etherscan,
    apiKey: bscscan,
  },
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    tests: "./test",
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  mocha: {
    timeout: 100000,
  }, };
