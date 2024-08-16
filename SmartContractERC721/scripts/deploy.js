const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.deployContract("MyTestToken");

  await contract.waitForDeployment();

  console.log(`The ERC721 contract deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});