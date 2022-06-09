const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = getNamedAccounts();
  const fundMeContract = await ethers.getContract("FundMe", deployer);
  console.log(`FundMe contract deployeed at: ${fundMeContract}`);
  const transactionResponse = await fundMeContract.fund({
    value: ethers.utils.parseEther("1"),
  });
  await transactionResponse.wait(1);
  console.log("Funded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
