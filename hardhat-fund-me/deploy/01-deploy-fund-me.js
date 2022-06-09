const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let priceFeedAddress;
  if (chainId == 31337) {
    // Mock Price Feed
    const ethUsdAggregator = await deployments.get("MockV3Aggregator"); // Get the latest deployment for "MockV3Aggregator"
    priceFeedAddress = ethUsdAggregator.address;
  } else {
    // Get price feed
    priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [priceFeedAddress],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, [priceFeedAddress]);
  }

  log("------------------");
};

module.exports.tags = ["all", "fundMe"];
