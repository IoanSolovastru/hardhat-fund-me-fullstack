const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = getNamedAccounts();
  const fundMeContract = await ethers.getContract("FundMe", deployer);
  const withdrawResponse = await fundMeContract.withdraw();
  await withdrawResponse.wait(1);
  console.log("Withdraw successfully ");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
