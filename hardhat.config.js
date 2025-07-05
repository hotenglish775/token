require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const NEXT_PUBLIC_RPU_URL = "https://rpc.ankr.com/eth_holesky";
const NEXT_PUBLIC_PRIVATE_KEY = "YOUR_PRIVATE_KEY";
module.exports = {
  solidity: "0.8.0",
  // defaultNetwork: "ETH",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // holesky: {
    //   url: NEXT_PUBLIC_RPU_URL,
    //   accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
    // },
  },
};
